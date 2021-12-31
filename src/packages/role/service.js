/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import { Op } from 'sequelize';
import repo from './repository';
import { commonLocale } from '../../locales'
import configs from '../../configs'
import permissionService from '../permission/service'

const create = async (body) => {
  const data = await repo.findOne({ role: body.role.toLowerCase() })
  if (data) {
    throw new Error(JSON.stringify(commonLocale.dataAlreadyExisted))
  }

  const role = await repo.create(body)
  if (role && body.permissions && body.permissions.length) {
    const { permissions } = body
    const rolePermissions = permissions.map((m) => {
      return {
        roleId: role._id,
        permissionId: m,
        createdById: body.createdById
      }
    })
    await repo.bulkCreateRolePermission(rolePermissions)
  }


  return role
}

const index = async (request) => {
  let { rows, count } = await repo.findAll(request)
  const modules = await permissionService.index({
    includes: ['_id', 'name', 'code', 'modulePrefix', 'status']
  })
  if (rows.length && modules.length) {
    rows = _.map(rows, m => m.get({ plain: true }))
    for (let role of rows) {
      const modu = _.cloneDeep(modules)
      handleIncludePermission(modu, role.permissions, role._id)
      role.modules = modu
      delete role.permissions
    }
  }

  return { rows, count }
}

const show = async (id) => {
  let role = await repo.findById(id)
  if (!role) {
    return {}
  }

  const modules = await permissionService.index({
    includes: ['_id', 'name', 'code', 'modulePrefix', 'status']
  })
  if (modules.length) {
    handleIncludePermission(modules, role.permissions, role._id)
    role = role.get({ plain: true })
    role.modules = modules
  }
  delete role.permissions

  return role
}

const handleIncludePermission = (modules, rolePermission, roleId) => {
  for (const module of modules) {
    for (let permission of module.permissions) {
      const isIncluded = _.find(rolePermission, f => f.code === permission.code)
      if (isIncluded || roleId == configs.superAdminRoleId) {
        permission.dataValues.isIncluded = true
      }
    }
  }
}


const update = async (id, body) => {
  const data = await repo.updateOne(id, body)
  if (id != configs.superAdminRoleId && data && body.permissions && body.permissions.length) {
    updatePermission(data, body)
  }

  return data
}

const updatePermission = async (data, body) => {
  const { permissions } = body
  for (const permissionId of permissions) {
    const permission = await permissionService.show(permissionId)
    if (!permission) {
      continue
    }
    await repo.createRolePermissionIfNotExist({
      roleId: data._id,
      permissionId,
      updatedById: body.updatedById
    })
  }

  await repo.destroyMultiRolePermisson({
    roleId: data._id,
    permissionId: {
      [Op.notIn]: permissions
    }
  })

  return true
}

const destroy = async (id) => {
  return repo.destroy(id)
}


export default {
  create,
  show,
  destroy,
  index,
  update
};
