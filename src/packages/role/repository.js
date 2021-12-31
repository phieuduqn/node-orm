import { RoleSeq, RolePermissionSeq, PermissionSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'

const findOne = async (query) => {
  return RoleSeq.findOne({
    where: {
      ...query
    },
    raw: true
  });
};

const findById = async (id) => {
  const data = await RoleSeq.findByPk(id, {
    include: {
      model: PermissionSeq,
      as: 'permissions',
      attributes: {
        exclude: ['RolePermission'],
        include: ['_id', 'name', 'code', 'modulePrefix', 'status']
      }
    },
    // raw: true
  });

  return data
};

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = false
  return RoleSeq.findAndCountAll({
    where: condition,
    ...option,
    include: {
      model: PermissionSeq,
      as: 'permissions',
      attributes: {
        exclude: ['RolePermission'],
        include: ['_id', 'name', 'code', 'modulePrefix', 'status']
      }
    },
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    }
  })
}

const create = async (body) => {
  const data = (await RoleSeq.create(body)).get({ plain: true });
  return data ? findById(data._id) : null;
};

const updateOne = async (id, body) => {
  await RoleSeq.update(body, {
    where: { _id: id },
    raw: true
  });

  return findById(id)
};

const destroy = async (id) => {
  return RoleSeq.destroy({ where: { _id: id } })
}

const destroyMultiRolePermisson = async (query) => {
  return RolePermissionSeq.destroy({
    where: query
  })
}

const bulkCreateRolePermission = async (data) => {
  return RolePermissionSeq.bulkCreate(data)
}

const createRolePermissionIfNotExist = async (item) => {
  return RolePermissionSeq.findOrCreate({
    where: {
      roleId: item.roleId,
      permissionId: item.permissionId,
    },
    defaults: item
  })
}

const findRolePermissions = async (query) => {
  return RolePermissionSeq.findAll({
    where: {
      ...query
    },
    raw: true
  });
};

export default {
  findAll,
  findById,
  findOne,
  create,
  updateOne,
  destroy,
  bulkCreateRolePermission,
  createRolePermissionIfNotExist,
  destroyMultiRolePermisson,
  findRolePermissions
};
