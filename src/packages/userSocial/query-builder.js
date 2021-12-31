import { Op } from 'sequelize';


const queryBuilderGetList = (request = {}) => {
  let match = {}

  if (request._id) {
    match._id = parseInt(request._id, 10)
  }


  if (request.alias) {
    match.alias = request.alias
  }

  if (request.name) {
    match.name = request.name
  }

  if (request.email) {
    match.email = request.email
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
    } else {
      match._id = {
        [Op.notIn]: [parseInt(request.ignoreIds, 10)],
      }
    }
  }

  if (request.search) {
    const searchQuery = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${request.search}%`
          }
        }, {
          alias: {
            [Op.like]: `%${request.search}%`
          }
        }
      ]
    }
    match = { ...match, ...searchQuery }
  }

  return match
}


export {
  queryBuilderGetList
}
