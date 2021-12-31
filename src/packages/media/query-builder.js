import { ObjectId } from '../../utils/mongoose'

const queryBuilderGetList = (request = {}) => {
  const match = {}
  const projection = null
  const options = {
    sort: { createdAt: -1 },
    skip: 0,
    limit: request.limit || 20
  }


  if (request.page) {
    options.skip = request.page * options.limit
  }
  if (options.sortBy) {
    options.sort = {
      [request.sortBy]: request.sortType || -1
    }
  }
  if (request._id) {
    options._id = new ObjectId(request._id)
  }

  return {
    query: match,
    projection,
    options
  }
}

export {
  queryBuilderGetList
}
