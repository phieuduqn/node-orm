import repo from './repository'

const index = async (request) => {
  return repo.findAll(request)
}

const show = async (id) => {
  return repo.findById(id)
}


export default {
  index,
  show
}

