import service from './service'
import to from '../../utils/to'
import { handleResponse } from '../../utils/handle-response';


const index = async (req, res) => {
  const [error, result] = await to(service.index(req.query))
  handleResponse(error, result, req, res)
}

const show = async (req, res) => {
  const [error, result] = await to(service.show(req.params.id))
  handleResponse(error, result, req, res)
}

const create = async (req, res) => {
  req.body.createdById = req.user._id
  const [error, result] = await to(service.create(req.body, req.user))
  handleResponse(error, result, req, res)
}

const update = async (req, res) => {
  req.body.updatedById = req.user._id
  const [error, result] = await to(service.update(req.params.id, req.body, req.user))
  handleResponse(error, result, req, res)
}

const destroy = async (req, res) => {
  const [error, result] = await to(service.destroy(req.params.id))
  handleResponse(error, result, req, res)
}

const destroyMultiple = async (req, res) => {
  const [error, result] = await to(service.destroyMultiple(req.body))
  handleResponse(error, result, req, res)
}

export default {
  index,
  show,
  create,
  update,
  destroy,
  destroyMultiple
}
