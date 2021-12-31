/* eslint-disable import/first */
/* eslint-disable eqeqeq */
/* eslint-disable guard-for-in */

import { handleResponse } from '../utils/handle-response';
import { commonLocale } from '../locales';
import { RoleSeq, PermissionSeq } from '../models';
import configs from '../configs'

export const PERMISSION = {
  read: 'read',
  create: 'create',
  update: 'update',
  delete: 'delete',
}

export const PERMISSION_MODULE = {
  user: 'user',
  moderator: 'moderator',
  role: 'role',
  setting: 'setting'
}

export const PERMISSION_MODULE_LIST = [{
  name: 'Users',
  prefix: 'user'
}, {
  name: 'Moderators',
  prefix: 'moderator'
}, {
  name: 'Roles',
  prefix: 'role'
}, {
  name: 'Settings',
  prefix: 'setting'
}]


/**
 *
 * @param {*} functionKeys this can accept string key or array with string key
 * @Example String 'p_view'
 * @Example Array ['user_edit','role_edit']
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const filter = (module, permission) => async (req, res, next) => {
  try {
    if (!req.user || !req.user.roleId) {
      return handleResponse(commonLocale.authenticationInfoNotFound, null, req, res)
    }
    const isAccess = await checkAccessPermission(req.user.roleId, getPermissionCode(module, permission))
    if (isAccess) {
      next();
    } else {
      return handleResponse(commonLocale.forbidden, null, req, res)
    }
  } catch (error) {
    console.log(error)
    handleResponse(commonLocale.authenticationInfoNotFound, null, req, res)
  }
}

const getPermissionCode = (module, permission) => {
  if (!module || !permission) {
    return ''
  }

  return `${module}_${permission}`
}

const checkAccessPermission = async (roleId, permissionCode) => {
  if (roleId == configs.superAdminRoleId) {
    return true
  }
  const condition = {
    _id: roleId,
  }
  const rolePer = await RoleSeq.findOne({
    where: condition,
    include: [{
      model: PermissionSeq,
      as: 'permissions',
      where: {
        code: permissionCode
      }
    }]
  })

  return !!rolePer
}
