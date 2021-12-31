import { commonLocale } from '../../locales'
import service from './service'
import to from '../../utils/to'
import { uploadImages, uploadDocs } from '../../utils/multer'
import { handleResponse } from '../../utils/handle-response';
import config from '../../configs'


const uploadImage = async (req, res) => {
  uploadImages.array('images')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return handleResponse({
          ...commonLocale.limitSize,
          value: {
            size: config.media.imageSizeLimit.text
          }
        }, null, req, res)
      }
      return handleResponse(commonLocale.invalidDataRequest, null, req, res)
    }

    if (req.invalidFile) {
      return handleResponse({
        code: commonLocale.invalidDataRequest.code,
        message: req.invalidFile
      }, null, req, res)
    }
    if (!req.files || !req.files.length) {
      return handleResponse(commonLocale.invalidDataRequest, null, req, res);
    }
    const [error, medias] = await to(service.uploadImage(req.files, req.user));
    return handleResponse(error, medias, req, res);
  })
}

/**
 * Upload Docs
 * @param {*} req
 * @param {*} res
 */
const uploadDoc = async (req, res) => {
  uploadDocs.array('files')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return handleResponse({
          ...commonLocale.limitSize,
          value: {
            size: config.media.docs.text
          }
        }, null, req, res)
      }
      return handleResponse(commonLocale.invalidDataRequest, null, req, res)
    }

    if (req.invalidFile) {
      return handleResponse({
        code: commonLocale.invalidDataRequest.code,
        message: req.invalidFile
      }, null, req, res)
    }
    if (!req.files || !req.files.length) {
      return handleResponse(commonLocale.invalidDataRequest, null, req, res);
    }
    const [error, medias] = await to(service.uploadDoc(req.files, req.user));
    return handleResponse(error, medias, req, res);
  })
}

const list = async (req, res) => {
  const [error, result] = await to(service.index(req.query))
  handleResponse(error, result, req, res)
}

const show = async (req, res) => {
  const [error, result] = await to(service.show(req.params.id))
  handleResponse(error, result, req, res)
}

export default {
  uploadImage,
  uploadDoc,
  list,
  show
}
