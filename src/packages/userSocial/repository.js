import { Op } from 'sequelize';
import { UserSocialSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'

const findOne = async (query) => {
  return UserSocialSeq.findOne({
    where: {
      ...query
    },
    raw: true
  });
};

const findById = async (id) => {
  return UserSocialSeq.findByPk(id, { raw: true });
};

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  return UserSocialSeq.findAndCountAll({
    where: condition,
    ...option,
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    }
  })
}

const create = async (body) => {
  const data = (await UserSocialSeq.create(body)).get({ plain: true });
  return data ? findById(data._id) : null;
};

const updateOne = async (id, body) => {
  await UserSocialSeq.update(body, {
    where: { _id: id },
    raw: true
  });

  return findById(id)
};


const destroyByQuery = async (query) => {
  return UserSocialSeq.destroy({ where: query })
}

const destroy = async (id) => {
  return UserSocialSeq.destroy({ where: { _id: id } })
}

const destroyMultiple = async (ids) => {
  return UserSocialSeq.destroy({ where: { _id: {
    [Op.in]: ids
  } } })
}

export default {
  findAll,
  findById,
  findOne,
  create,
  updateOne,
  destroy,
  destroyMultiple,
  destroyByQuery
};
