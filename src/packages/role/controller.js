import lodash from 'lodash'
import { handleResponse } from '../../utils/handle-response';
import to from '../../utils/to'
import service from './service'
import config from './config'

async function create(req, res) {
  const body = lodash.pick(req.body, config.ALLOWED_CREATE_ATTRIBUTE);
  body.createdById = req.user._id
  const [error, result] = await to(service.create(body));
  return handleResponse(error, result, req, res);
}

async function update(req, res) {
  const body = lodash.pick(req.body, config.ALLOWED_UPDATE_ATTRIBUTE);
  body.updatedById = req.user._id
  const [error, result] = await to(service.update(req.params.id, body));
  return handleResponse(error, result, req, res);
}

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
  create,
  destroy,
  update,
  show
};

