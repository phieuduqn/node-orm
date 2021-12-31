import { commonCode } from './response-code'

export default {
  socialTokenVerifyFailed: {
    code: commonCode.tokenVerifyFailed,
    message: 'common.socialTokenVerifyFailed'
  },
  tokenVerifyFailed: {
    code: commonCode.unAuthorizedCode,
    message: 'common.tokenVerifyFailed'
  },
  loginFailed: {
    code: commonCode.badRequest,
    message: 'common.loginFailed'
  },
  noToken: {
    code: commonCode.unAuthorizedCode,
    message: 'common.noToken'
  },
  forbidden: {
    code: commonCode.forbidden,
    message: 'common.forbidden'
  },
  authenticationInfoNotFound: {
    code: commonCode.unAuthorizedCode,
    message: 'common.authenticationInfoNotFound'
  },
  apiNotFound: {
    code: commonCode.apiNotFound,
    message: 'common.apiNotFound'
  },
  serverError: {
    code: commonCode.serverError,
    message: 'common.serverError'
  },
  notFound: {
    code: commonCode.badRequest,
    message: 'common.notFound'
  },
  validationCodeExpired: {
    code: commonCode.badRequest,
    message: 'common.validationCodeExpired'
  },
  timesResendOTP: {
    code: commonCode.badRequest,
    message: 'common.timesResendOTP'
  },
  invalidCode: {
    code: commonCode.badRequest,
    message: 'common.invalidCode'
  },
  dataAlreadyExisted: {
    code: commonCode.duplicate,
    message: 'common.dataAlreadyExisted'
  },
  nameAlreadyExisted: {
    code: commonCode.duplicate,
    message: 'common.nameAlreadyExisted'
  },
  somethingWrong: {
    code: commonCode.badRequest,
    message: 'common.somethingWrong'
  },
  invalidObjectId: {
    code: commonCode.badRequest,
    message: 'common.invalidObjectId'
  },
  invalidDataRequest: {
    code: commonCode.badRequest,
    message: 'common.invalidDataRequest'
  },
  inputLocation: {
    code: commonCode.badRequest,
    message: 'common.inputLocation'
  },
  limitExceeded: {
    code: commonCode.limitExceeded,
    message: 'common.limitExceeded'
  },
  limitSize: {
    code: commonCode.badRequest,
    message: 'media.limitFileSize'
  },
  format: {
    code: commonCode.badRequest,
    message: 'media.format'
  },
  invalidFile: {
    code: commonCode.badRequest,
    message: 'media.invalidFile'
  },
  requestProcessing: {
    code: commonCode.badRequest,
    message: 'common.requestProcessing'
  },
  existBid: {
    code: commonCode.badRequest,
    message: 'bid.exist'
  },
  limitRetract: {
    code: commonCode.badRequest,
    message: 'bid.limitRetract'
  },
  dataHasChanged: {
    code: commonCode.badRequest,
    message: 'common.dataHasChanged'
  },
  socialUserNotFound: {
    code: commonCode.badRequest,
    message: 'common.socialUserNotFound'
  },
  customRequireField: {
    code: commonCode.badRequest,
    message: 'common.customRequireField'
  },
  invalidAddress: {
    code: commonCode.badRequest,
    message: 'common.invalidAddress'
  }
}
