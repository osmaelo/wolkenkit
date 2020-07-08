import { ApolloClient } from 'apollo-client';
import { assert } from 'assertthat';
import { buildDomainEvent } from '../../../../../lib/common/utils/test/buildDomainEvent';
import { Client } from '../../../../../lib/apis/getHealth/http/v2/Client';
import { CommandData } from '../../../../../lib/common/elements/CommandData';
import { Client as CommandDispatcherClient } from '../../../../../lib/apis/awaitItem/http/v2/Client';
import { CommandWithMetadata } from '../../../../../lib/common/elements/CommandWithMetadata';
import { DomainEventWithState } from '../../../../../lib/common/elements/DomainEventWithState';
import fetch from 'node-fetch';
import { getAvailablePorts } from '../../../../../lib/common/utils/network/getAvailablePorts';
import { getTestApplicationDirectory } from '../../../../shared/applications/getTestApplicationDirectory';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import { Client as PublishMessageClient } from '../../../../../lib/apis/publishMessage/http/v2/Client';
import { sleep } from '../../../../../lib/common/utils/sleep';
import { startProcess } from '../../../../../lib/runtimes/shared/startProcess';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { uuid } from 'uuidv4';
import { waitForSignals } from 'wait-for-signals';
import { WebSocketLink } from 'apollo-link-ws';
import ws from 'ws';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

suite('main', function (): void {
  this.timeout(10_000);
  const applicationDirectory = getTestApplicationDirectory({ name: 'base' });

  const subscribeMessagesChannel = 'newDomainEvent';

  let commandDispatcherClient: CommandDispatcherClient<CommandWithMetadata<CommandData>>,
      commandDispatcherHealthPort: number,
      commandDispatcherPort: number,
      healthPort: number,
      port: number,
      publisherHealthPort: number,
      publisherPort: number,
      publishMessageClient: PublishMessageClient,
      stopProcess: (() => Promise<void>) | undefined,
      stopProcessCommandDispatcher: (() => Promise<void>) | undefined,
      stopProcessPublisher: (() => Promise<void>) | undefined;

  setup(async (): Promise<void> => {
    [
      port,
      healthPort,
      commandDispatcherPort,
      commandDispatcherHealthPort,
      publisherPort,
      publisherHealthPort
    ] = await getAvailablePorts({ count: 6 });

    stopProcessCommandDispatcher = await startProcess({
      runtime: 'microservice',
      name: 'commandDispatcher',
      enableDebugMode: false,
      port: commandDispatcherHealthPort,
      env: {
        APPLICATION_DIRECTORY: applicationDirectory,
        PRIORITY_QUEUE_STORE_OPTIONS: `{"expirationTime":${5000}}`,
        PORT: String(commandDispatcherPort),
        HEALTH_PORT: String(commandDispatcherHealthPort)
      }
    });

    commandDispatcherClient = new CommandDispatcherClient<CommandWithMetadata<CommandData>>({
      port: commandDispatcherPort,
      hostName: 'localhost',
      path: '/await-command/v2',
      protocol: 'http',
      createItemInstance ({ item }): CommandWithMetadata<CommandData> {
        return new CommandWithMetadata(item);
      }
    });

    stopProcessPublisher = await startProcess({
      runtime: 'microservice',
      name: 'publisher',
      enableDebugMode: false,
      port: publisherHealthPort,
      env: {
        PORT: String(publisherPort),
        HEALTH_PORT: String(publisherHealthPort)
      }
    });

    publishMessageClient = new PublishMessageClient({
      protocol: 'http',
      hostName: 'localhost',
      port: publisherPort,
      path: '/publish/v2'
    });

    stopProcess = await startProcess({
      runtime: 'microservice',
      name: 'graphql',
      enableDebugMode: false,
      port: healthPort,
      env: {
        APPLICATION_DIRECTORY: applicationDirectory,
        ENABLE_INTEGRATED_CLIENT: String(false),
        CORS_ORIGIN: '*',
        DOMAIN_EVENT_STORE_TYPE: 'InMemory',
        PORT: String(port),
        HEALTH_PORT: String(healthPort),
        SUBSCRIBE_MESSAGES_PROTOCOL: 'http',
        SUBSCRIBE_MESSAGES_HOST_NAME: 'localhost',
        SUBSCRIBE_MESSAGES_PORT: String(publisherPort),
        SUBSCRIBE_MESSAGES_CHANNEL: subscribeMessagesChannel,
        SNAPSHOT_STRATEGY: `{"name":"never"}`,
        COMMAND_DISPATCHER_PROTOCOL: 'http',
        COMMAND_DISPATCHER_HOST_NAME: 'localhost',
        COMMAND_DISPATCHER_PORT: String(commandDispatcherPort),
        COMMAND_DISPATCHER_RETRIES: String(5)
      }
    });
  });

  teardown(async (): Promise<void> => {
    if (stopProcess) {
      await stopProcess();
    }
    if (stopProcessPublisher) {
      await stopProcessPublisher();
    }
    if (stopProcessCommandDispatcher) {
      await stopProcessCommandDispatcher();
    }

    stopProcess = undefined;
    stopProcessPublisher = undefined;
    stopProcessCommandDispatcher = undefined;
  });

  suite('getHealth', (): void => {
    test('is using the health API.', async (): Promise<void> => {
      const healthClient = new Client({
        protocol: 'http',
        hostName: 'localhost',
        port: healthPort,
        path: '/health/v2'
      });

      await assert.that(
        async (): Promise<any> => await healthClient.getHealth()
      ).is.not.throwingAsync();
    });
  });

  suite('graphql', (): void => {
    test('has a command mutation endpoint.', async (): Promise<void> => {
      const link = new HttpLink({
        uri: `http://localhost:${port}/graphql/v2`,
        fetch: fetch as any
      });
      const cache = new InMemoryCache();

      const client = new ApolloClient<NormalizedCacheObject>({
        link,
        cache
      });

      const mutation = gql`
        mutation ($aggregateId: String!, $data: SampleContext_sampleAggregate_executeT0!) {
          command {
            sampleContext {
              sampleAggregate(id: $aggregateId) {
                execute(data: $data) {
                  id
                }
              }
            }
          }
        }
      `;

      const result = await client.mutate({
        mutation,
        variables: {
          aggregateId: uuid(),
          data: {
            strategy: 'succeed'
          }
        }
      });

      assert.that(result?.data?.command.sampleContext?.sampleAggregate?.execute?.id).is.not.undefined();

      const { item } = await commandDispatcherClient.awaitItem();

      assert.that(item.id).is.equalTo(result.data.command.sampleContext.sampleAggregate.execute.id);
    });

    test('has a subscription endpoint.', async (): Promise<void> => {
      const subscriptionClient = new SubscriptionClient(
        `ws://localhost:${port}/graphql/v2/`,
        {},
        ws
      );
      const link = new WebSocketLink(subscriptionClient);
      const cache = new InMemoryCache();

      const client = new ApolloClient<NormalizedCacheObject>({
        link,
        cache
      });

      const query = gql`
        subscription {
          domainEvents {
            id
          }
        }
      `;

      const observable = client.subscribe({
        query
      });

      const aggregateId = uuid();
      const domainEvent = new DomainEventWithState({
        ...buildDomainEvent({
          contextIdentifier: {
            name: 'sampleContext'
          },
          aggregateIdentifier: {
            name: 'sampleAggregate',
            id: aggregateId
          },
          name: 'succeeded',
          data: {},
          metadata: {
            revision: 1,
            initiator: { user: { id: 'jane.doe', claims: { sub: 'jane.doe' }}}
          }
        }),
        state: {
          previous: { domainEventNames: []},
          next: { domainEventNames: [ 'succeeded' ]}
        }
      });

      const collector = waitForSignals({ count: 1 });

      observable.subscribe(async (): Promise<void> => {
        await collector.signal();
      });

      await sleep({ ms: 100 });

      await publishMessageClient.postMessage({
        channel: subscribeMessagesChannel,
        message: domainEvent
      });

      await collector.promise;
    });
  });
});
