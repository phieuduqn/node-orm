import moment from 'moment'
import { UserSeq, VerifyEmailSeq, UserAccessSeq, UserStatSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'


async function findById(id, includesPwd = false) {
  if (includesPwd) {
    return UserSeq.findByPk(id, {
      include: ['socials', 'experiences', 'education', 'country', 'stats'],
    })
  }
  return UserSeq.findByPk(id, {
    include: ['socials', 'experiences', 'education', 'country', 'stats'],
    attributes: {
      exclude: ['password']
    }
  });
}

async function userBidInfo(id, attr = undefined) {
  return UserSeq.findByPk(id, {
    attributes: attr,
  });
}

async function findOne(query) {
  return UserSeq.findOne({
    where: {
      ...query
    },
    include: ['socials', 'experiences', 'education', 'country', 'stats'],
  });
}

async function create(body) {
  return (await UserSeq.create(body)).get({ plain: true })
}


async function updateOneById(id, body) {
  return UserSeq.update(body, { where: { _id: id } })
}


async function updateOne(query, body) {
  return UserSeq.update(body, { where: { ...query } })
}


const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return UserSeq.findAndCountAll({
    where: condition,
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    },
    include: ['socials', 'experiences', 'education', 'country', 'stats'],
    ...option,
    distinct: true,
  })
}

async function countDocuments(query = {}) {
  const condition = queryBuilderGetList(query)

  return UserSeq.count({
    where: condition
  })
}


async function findOneVerifyEmailSeq(query) {
  return VerifyEmailSeq.findOne({ where: { ...query } }, { raw: true })
}

async function updateVerifyEmailSeq(email, body = {}) {
  return VerifyEmailSeq.update(body, {
    where: { email },
    raw: true
  })
}

async function createVerifyEmail(email, code, expiredTime) {
  return VerifyEmailSeq.create({ email, code, expiredTime })
}


async function createOrUpdateUserAccess(body) {
  const { email, ip, browser } = body
  const data = await UserAccessSeq.findOne({
    where: {
      email, ip, browser
    },
    raw: true
  })
  if (data) {
    return UserAccessSeq.update(body, {
      where: {
        _id: data._id,
      }
    })
  } else {
    return UserAccessSeq.create(body)
  }
}

/**
 *
 * @param {integer} userId
 * @param {string} field totalBid totalApproved totalCompleted
 * @param {number} number 1, -1,//
 * @returns
 */
const createOrUpdateUserStat = async (userId, field, number) => {
  const uId = parseInt(userId, 10)
  const condition = {
    userId: uId
  }
  const data = await UserStatSeq.findOne({
    where: condition,
    raw: true
  })

  if (!data) {
    // CREATE NEW ONE
    await UserStatSeq.create({
      userId,
      [field]: 1,
    })
  } else {
    // increment
    await UserStatSeq.increment(field, { by: number, where: condition })
  }

  const newData = await UserStatSeq.findOne({
    where: condition,
    raw: true
  })
  if (newData && newData.totalCompAndFail > 0) {
    await UserStatSeq.update({
      successRate: Math.round(newData.totalCompleted / newData.totalCompAndFail * 100),
    }, { where: condition })
  }


  return UserStatSeq.findOne({
    where: condition,
    raw: true
  })
}

const destroyOne = async (id) => {
  const des = {
    isDeleted: true,
    deletedAt: moment().toDate()
  }

  await UserSeq.update(des, { where: { _id: id } })

  return {
    _id: id,
    ...des
  }
}

export default {
  findById,
  findAll,
  create,
  findOne,
  updateOne,
  updateOneById,
  countDocuments,
  //
  createVerifyEmail,
  findOneVerifyEmailSeq,
  updateVerifyEmailSeq,
  //
  createOrUpdateUserAccess,
  //
  userBidInfo,
  createOrUpdateUserStat,
  destroyOne
}
