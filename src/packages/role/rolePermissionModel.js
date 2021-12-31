import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { ModeratorSeq, RoleSeq, PermissionSeq } from '../../models'
import config from './config'

const RolePermissionSeq = dbConfig.define(
  'RolePermission',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: RoleSeq,
        key: '_id'
      },
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      references: {
        model: PermissionSeq,
        key: '_id'
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: config.status.active,
      allowNull: false,
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE(3),
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
    }
  },
  {
    timestamps: true,
    tableName: 'roles_permissions',
  },
)

setTimeout(() => {
  RolePermissionSeq.belongsTo(ModeratorSeq, {
    as: 'createdBy',
    foreignKey: 'createdById'
  })
  RolePermissionSeq.belongsTo(ModeratorSeq, {
    as: 'updatedBy',
    foreignKey: 'updatedById'
  })
}, 0)

export default RolePermissionSeq
