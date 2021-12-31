import { CountrySeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'

const findOne = async (query) => {
  return CountrySeq.findOne({
    where: {
      ...query
    },
    raw: true
  });
};

const findById = async (id) => {
  return CountrySeq.findByPk(id, { raw: true });
};

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  return CountrySeq.findAndCountAll({
    where: condition,
    ...option,
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    }
  })
}

export default {
  findAll,
  findById,
  findOne
};
