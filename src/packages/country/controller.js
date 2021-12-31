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

export default {
  index,
  show
}
