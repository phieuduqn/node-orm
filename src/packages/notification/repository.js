import { NotificationSeq, UserSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'


const findOne = async (query) => {
  return NotificationSeq.findOne({
    where: {
      ...query
    },
    include: [{
      model: UserSeq,
      attributes: ['_id', 'email', 'avatar', 'fullName'],
      as: 'from'
    }, {
      model: UserSeq,
      attributes: ['_id', 'email', 'avatar', 'fullName'],
      as: 'to'
    }],
  });
};

const findById = async (id) => {
  return NotificationSeq.findByPk(id, {
    include: [{
      model: UserSeq,
      attributes: ['_id', 'email', 'avatar', 'fullName'],
      as: 'from'
    }, {
      model: UserSeq,
      attributes: ['_id', 'email', 'avatar', 'fullName'],
      as: 'to'
    }],
  });
};


const countRecords = async (request) => {
  const condition = queryBuilderGetList(request)

  return NotificationSeq.count({ where: condition })
}

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = false // TO MAKE VIRTUAL FIELD WORK
  return NotificationSeq.findAndCountAll({
    where: condition,
    ...option,
    include: [{
      model: UserSeq,
      attributes: ['_id', 'email', 'avatar', 'fullName'],
      as: 'from'
    }, {
      model: UserSeq,
      attributes: ['_id', 'email', 'avatar', 'fullName'],
      as: 'to'
    }],
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    }
  })
}

const create = async (body) => {
  const data = await NotificationSeq.create(body);
  return data ? findById(data._id) : null;
};

const updateOne = async (id, body) => {
  await NotificationSeq.update(body, {
    where: { _id: id },
    raw: true
  });

  return findById(id)
};

const destroy = async (id) => {
  return NotificationSeq.destroy({ where: { _id: id } })
}

const destroyMultiple = async (request) => {
  const condition = queryBuilderGetList(request)
  return NotificationSeq.destroy({ where: condition })
}

const markAsRead = async (request) => {
  const condition = queryBuilderGetList(request)
  return NotificationSeq.update({ read: 1 }, { where: condition })
}


export default {
  findAll,
  findById,
  findOne,
  create,
  updateOne,
  destroy,
  destroyMultiple,
  countRecords,
  markAsRead
};
