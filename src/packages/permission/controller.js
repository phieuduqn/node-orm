import { handleResponse } from '../../utils/handle-response';
import to from '../../utils/to'
import service from './service'

async function show(req, res) {
  const [error, result] = await to(service.show(req.params.id));
  return handleResponse(error, result, req, res);
}

async function destroy(req, res) {
  const [error, result] = await to(service.destroy(req.params.id));
  handleResponse(error, result, req, res);
}


async function index(req, res) {
  const [error, result] = await to(service.index(req.query));
  handleResponse(error, result, req, res);
}


export default {
  index,
  destroy,
  show
};

