/* eslint-disable no-unused-vars */
import { Op } from 'sequelize';
import { commonLocale } from '../../locales'
import repo from './repository'


const index = async (request) => {
  return repo.findAll(request)
}

const show = async (id) => {
  return repo.findById(id)
}

const create = async (body) => {
  const findOne = await repo.findOne({ _id: 1 })
  if (findOne) {
    throw new Error(JSON.stringify(commonLocale.dataAlreadyExisted))
  }
  body._id = 1
  return repo.create(body)
}

const updateOne = async (id, body) => {
  const query = {
    _id: 1
  }
  await repo.updateOne(query, body)

  return repo.findById(id)
}


export default {
  index,
  show,
  create,
  updateOne
}

