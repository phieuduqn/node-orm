import { PermissionSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'

const findOne = async (query) => {
  return PermissionSeq.findOne({
    where: {
      ...query
    },
    raw: true
  });
};

const findById = async (id) => {
  const data = await PermissionSeq.findByPk(id, { raw: true });
  return data
};

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  return PermissionSeq.findAll({
    where: condition,
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    }
  })
}

const destroy = async (id) => {
  return PermissionSeq.destroy({ where: { _id: id } })
}

export default {
  findAll,
  findById,
  findOne,
  destroy
};
