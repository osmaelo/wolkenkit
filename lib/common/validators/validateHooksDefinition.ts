import { errors } from '../errors';
import { isFunction, isObjectLike, isUndefined } from 'lodash';

const validateHooksDefinition = function ({ hooksDefinition }: {
  hooksDefinition: any;
}): void {
  if (!isObjectLike(hooksDefinition)) {
    throw new errors.HooksDefinitionMalformed('Hooks definition is not an object.');
  }

  if (!isUndefined(hooksDefinition.addingFile)) {
    if (!isFunction(hooksDefinition.addingFile)) {
      throw new errors.HooksDefinitionMalformed(`Property 'addingFile' is not a function.`);
    }
  }

  if (!isUndefined(hooksDefinition.addedFile)) {
    if (!isFunction(hooksDefinition.addedFile)) {
      throw new errors.HooksDefinitionMalformed(`Property 'addedFile' is not a function.`);
    }
  }

  if (!isUndefined(hooksDefinition.gettingFile)) {
    if (!isFunction(hooksDefinition.gettingFile)) {
      throw new errors.HooksDefinitionMalformed(`Property 'gettingFile' is not a function.`);
    }
  }

  if (!isUndefined(hooksDefinition.gotFile)) {
    if (!isFunction(hooksDefinition.gotFile)) {
      throw new errors.HooksDefinitionMalformed(`Property 'gotFile' is not a function.`);
    }
  }

  if (!isUndefined(hooksDefinition.removingFile)) {
    if (!isFunction(hooksDefinition.removingFile)) {
      throw new errors.HooksDefinitionMalformed(`Property 'removingFile' is not a function.`);
    }
  }

  if (!isUndefined(hooksDefinition.removedFile)) {
    if (!isFunction(hooksDefinition.removedFile)) {
      throw new errors.HooksDefinitionMalformed(`Property 'removedFile' is not a function.`);
    }
  }
};

export { validateHooksDefinition };
