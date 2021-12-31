import { Op, Sequelize } from 'sequelize';
import stringUtil from '../../utils/stringUtil'

const queryBuilderGetList = (request = {}) => {
  const match = {
    [Op.and]: []
  }

  if (request._id) {
    match._id = parseInt(request._id, 10)
  }
  if (request.ids) {
    match._id = {
      [Op.in]: request.ids
    }
  }


  if (typeof request.isVerifiedEmail === 'boolean') {
    match.isVerifiedEmail = request.isVerifiedEmail
  }


  if (typeof request.isIdentityVerified === 'boolean') {
    match.isIdentityVerified = request.isIdentityVerified
  }


  if (request.isDeleted) {
    const value = stringUtil.stringToBoolean(request.isDeleted)
    if (typeof value === 'boolean') {
      match.isDeleted = value
    }
  } else {
    match.isDeleted = false
  }


  if (request.isBlocked) {
    if (typeof request.isDeleted === 'boolean') {
      match.isBlocked = request.isBlocked
    }
  } else {
    match[Op.and].push({
      [Op.or]: [{
        isBlocked: false
      }, {
        isBlocked: { [Op.eq]: null }
      }, {
        isBlocked: true,
        blockedExpire: {
          [Op.lte]: new Date()
        }
      }]
    })
  }


  if (request.inCoinUnit && request.inCoinUnit.length) {
    match[Op.and].push({
      [Op.or]: [
        {
          coinUnit: {
            [Op.in]: request.inCoinUnit
          }
        },
        {
          replHourlyRate: { [Op.not]: null }
        }]
    })
  }

  if (request.status !== undefined) {
    if (typeof request.status === 'string' && request.status.includes(',')) {
      match.status = {
        [Op.in]: request.status
          .split(',')
          .map(m => m && parseInt(m, 10))
          .filter(f => f),
      }
    } else if (Array.isArray(request.status)) {
      match.status = {
        [Op.in]: request.status.map(m => m && parseInt(m, 10)).filter(f => f),
      }
    } else {
      match.status = parseInt(request.status, 10)
    }
  }


  if (request.ignoreIds !== undefined) {
    if (request.ignoreIds.includes(',')) {
      match._id = {
        [Op.notIn]: request.ignoreIds
          .split(',')
          .map(m => m && parseInt(m, 10))
          .filter(f => f),
      }
    } else if (Array.isArray(request.ignoreIds)) {
      match._id = {
        [Op.notIn]: request.ignoreIds
      }
    } else {
      match._id = {
        [Op.notIn]: [parseInt(request.ignoreIds, 10)],
      }
    }
  }
  if (request.skills) {
    if (typeof request.skills === 'string' && request.skills.includes(',')) {
      match[Op.and].push({
        [Op.or]: request.skills.split(',').map((m) => {
          return Sequelize.fn('JSON_CONTAINS', Sequelize.col('skills'), Sequelize.cast(`{"code": "${m}"}`, 'CHAR CHARACTER SET utf8'))
        })
      })
    } else if (Array.isArray(request.skills)) {
      match[Op.and].push({
        [Op.or]: request.skills.map((m) => {
          return Sequelize.fn('JSON_CONTAINS', Sequelize.col('skills'), Sequelize.cast(`{"code": "${m}"}`, 'CHAR CHARACTER SET utf8'))
        })
      })
    } else {
      match[Op.and].push({
        [Op.and]: [
          Sequelize.fn('JSON_CONTAINS', Sequelize.col('skills'), Sequelize.cast(`{"code": "${request.skills}"}`, 'CHAR CHARACTER SET utf8'))
        ]
      })
    }
  }

  if (request.search) {
    const searchQuery = {
      [Op.or]: [
        {
          email: {
            [Op.like]: `%${request.search}%`
          }
        }, {
          fullName: {
            [Op.like]: `%${request.search}%`
          }
        }, {
          description: {
            [Op.like]: `%${request.search}%`
          }
        }, {
          headline: {
            [Op.like]: `%${request.search}%`
          }
        }
      ]
    }
    match[Op.and].push(searchQuery)
  }

  return match
}

const buildUpdateUserAfterLogin = function (resultToken = {}) {
  const rs = {
    lastLogin: new Date().toISOString(),
    accessToken: resultToken.accessToken
  }

  return rs
}

export {
  queryBuilderGetList,
  buildUpdateUserAfterLogin
}
