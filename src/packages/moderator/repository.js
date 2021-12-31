import { ModeratorSeq, VerifyEmailSeq, RoleSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'


async function findById(id, includesPwd = false) {
  if (includesPwd) {
    return ModeratorSeq.findByPk(id)
  }
  const attributes = ['_id', 'avatar', 'fullName']
  return ModeratorSeq.findByPk(id, {
    attributes: {
      exclude: ['password'],
    },
    include: [{
      model: ModeratorSeq,
      as: 'createdBy',
      attributes
    },
    {
      model: ModeratorSeq,
      as: 'updatedBy',
      attributes
    },
    {
      model: RoleSeq,
      as: 'role'
    }],
  });
}

async function findOne(query) {
  return ModeratorSeq.findOne({
    where: {
      ...query
    }
  });
}

async function create(body) {
  return (await ModeratorSeq.create(body)).get({ plain: true })
}

async function updateOne(query, body) {
  return ModeratorSeq.update(body, { where: { ...query } })
}

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  const attributes = ['_id', 'avatar', 'fullName']
  return ModeratorSeq.findAndCountAll({
    where: condition,
    ...option,
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    },
    include: [{
      model: ModeratorSeq,
      as: 'createdBy',
      attributes
    },
    {
      model: ModeratorSeq,
      as: 'updatedBy',
      attributes
    },
    {
      model: RoleSeq,
      as: 'role'
    }],
    distinct: true,
  })
}

async function countDocuments(query) {
  return ModeratorSeq.count(query)
}

const destroy = async (id) => {
  return ModeratorSeq.destroy({ where: { _id: id } })
}

async function updateVerifyEmailSeq(email, body = {}) {
  return VerifyEmailSeq.update(body, {
    where: { email },
    raw: true
  })
}

async function findOneVerifyEmailSeq(query) {
  return VerifyEmailSeq.findOne({ where: { ...query } }, { raw: true })
}

export default {
  findById,
  findAll,
  create,
  findOne,
  updateOne,
  countDocuments,
  destroy,
  updateVerifyEmailSeq,
  findOneVerifyEmailSeq
}
