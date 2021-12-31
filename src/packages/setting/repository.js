import { SettingSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'

const create = async (body) => {
  return SettingSeq.create(body);
};

async function updateOne(query, body) {
  return SettingSeq.update(body, { where: { ...query } })
}

async function destroy(query) {
  return SettingSeq.destroy({ where: { ...query } })
}

const findOne = async (query) => {
  return SettingSeq.findOne({
    where: {
      ...query
    },
    raw: true
  });
};

const findById = async (id) => {
  return SettingSeq.findByPk(id, { raw: true });
};

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)

  return SettingSeq.findAndCountAll({
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
  findOne,
  create,
  updateOne,
  destroy
};
