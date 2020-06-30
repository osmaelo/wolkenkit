import { defekt } from 'defekt';

const errors = defekt({
  AggregateDefinitionMalformed: {},
  AggregateIdentifierMalformed: {},
  AggregateNotFound: {},
  ApplicationMalformed: {},
  ApplicationNotFound: {},
  ClaimsMalformed: {},
  CommandNotAuthorized: {},
  CommandHandlerMalformed: {},
  CommandMalformed: {},
  CommandNotFound: {},
  CommandRejected: {},
  CompilationFailed: {},
  ContentTypeMismatch: {},
  ContextNotFound: {},
  CorsOriginInvalid: {},
  DatabaseTypeInvalid: {},
  DirectoryAlreadyExists: {},
  DirectoryNotFound: {},
  DispatchFailed: {},
  DockerFailed: {},
  DockerBuildFailed: {},
  DockerNotReachable: {},
  DockerPushFailed: {},
  DomainEventAlreadyExists: {},
  DomainEventHandlerMalformed: {},
  DomainEventNotAuthorized: {},
  DomainEventNotFound: {},
  DomainEventMalformed: {},
  DomainEventRejected: {},
  DomainEventUnknown: {},
  ExecutableNotFound: {},
  ExpirationInPast: {},
  FileAlreadyExists: {},
  FileNotFound: {},
  FlowDefinitionMalformed: {},
  FlowDomainEventHandlerMalformed: {},
  FlowNotFound: {},
  GraphQlError: {},
  IdentifierMismatch: {},
  InvalidOperation: {},
  ItemAlreadyExists: {},
  ItemIdentifierMalformed: {},
  ItemIdentifierNotFound: {},
  ItemNotFound: {},
  ItemNotLocked: {},
  LockAcquireFailed: {},
  LockExpired: {},
  LockRenewalFailed: {},
  NotAuthenticatedError: {},
  ParameterInvalid: {},
  ProjectionHandlerMalformed: {},
  PublisherTypeInvalid: {},
  QueryHandlerMalformed: {},
  RequestFailed: {},
  RequestMalformed: {},
  RevisionAlreadyExists: {},
  RevisionTooLow: {},
  SnapshotMalformed: {},
  SubscriberTypeInvalid: {},
  TokenMismatch: {},
  TypeInvalid: {},
  UnknownError: {},
  ViewDefinitionMalformed: {}
});

export { errors };
