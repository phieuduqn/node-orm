/* eslint-disable eqeqeq */
import { BAD_REQUEST_CODE,
  SERVER_ERROR_CODE,
  SUCCESS_CODE,
  ACCEPT_ERROR_STATUS
} from '../packages/system/authorizator'
import responseBuilder from './response-builder'
import errorUtil from '../utils/error';

const handleMessageResponse = (error, req, res, status = BAD_REQUEST_CODE, success = false, data) => {
  return !error ? res.status(status).jsonp(responseBuilder.build(
    success,
    data,
    {
      code: status,
      message: 'success'
    }
  )) : res.status(status).jsonp(responseBuilder.build(
    success,
    data,
    {
      ...error,
      code: status,
    }
  ));
};

const handleResponse = (error, result, req, res) => {
  if (error) {
    errorUtil.parseError(error)
    if (error.code) {
      return handleMessageResponse(error, req, res, ACCEPT_ERROR_STATUS.includes(error.code) ? error.code : BAD_REQUEST_CODE);
    }
    return handleMessageResponse(error, req, res, SERVER_ERROR_CODE);
  }
  handleMessageResponse(null, req, res, SUCCESS_CODE, true, result);
};


module.exports = {
  handleResponse
};
