import repo from './repository'

const index = async (request) => {
  return repo.findAll(request)
}

const show = async (id) => {
  return repo.findById(id)
}

const create = async (body = {}) => {
  return repo.create(body)
}

const update = async (id, body) => {
  return repo.updateOne(id, body)
}

const destroy = async (id) => {
  return repo.destroy(id)
}

const destroyMultiple = async (body) => {
  const { ids } = body
  return repo.destroyMultiple(ids)
}


export default {
  index,
  show,
  create,
  update,
  destroy,
  destroyMultiple
}

