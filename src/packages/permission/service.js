/* eslint-disable no-unused-vars */
import repo from './repository';
import { PERMISSION_MODULE_LIST } from '../../author/cms.author'


const index = async (request) => {
  const data = await Promise.all(PERMISSION_MODULE_LIST.map(async (m) => {
    const permissions = await repo.findAll({ ...request, modulePrefix: m.prefix })
    return {
      ...m,
      permissions
    }
  }))

  return data || []
}

const show = async (id) => {
  return repo.findById(id)
}

const destroy = async (id) => {
  return repo.destroy(id)
}

export default {
  show,
  destroy,
  index,
};
