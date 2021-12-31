import service from './service'
import to from '../../utils/to'
import { handleResponse } from '../../utils/handle-response';


const show = async (req, res) => {
  const [error, result] = await to(service.show(req.params.id))
  handleResponse(error, result, req, res)
}

const create = async (req, res) => {
  const [error, result] = await to(service.create(req.body, req.user))
  handleResponse(error, result, req, res)
}

const update = async (req, res) => {
  const [error, result] = await to(service.updateOne(req.params.id, req.body, req.user))
  handleResponse(error, result, req, res)
}


export default {
  show,
  create,
  update,
}
