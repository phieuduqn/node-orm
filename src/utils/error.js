/* eslint-disable prefer-destructuring */
import { commonLocale } from '../locales'
import logger from '../logger'
import { SERVER_ERROR_CODE } from '../packages/system/authorizator';

function parseError(error) {
  if (!error) {
    return error;
  }
  let message = '';
  let code = SERVER_ERROR_CODE;
  if (error.errors) {
    const keys = Object.keys(error.errors);
    message = error.errors[keys[0]] ? error.errors[keys[0]].message : commonLocale.serverError
  } else {
    message = error.message;
    code = error.code ? error.code : SERVER_ERROR_CODE
  }

  logger.error(message, { error });

  return {
    success: false,
    message,
    code
  }
}
export default {
  parseError
}
