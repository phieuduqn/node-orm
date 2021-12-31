import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { ModeratorSeq, RolePermissionSeq, PermissionSeq } from '../../models'
import config from './config'

const RoleSeq = dbConfig.define(
  'Role',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
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
    tableName: 'roles',
  },
)

setTimeout(() => {
  RoleSeq.belongsTo(ModeratorSeq, {
    as: 'createdBy',
    foreignKey: 'createdById'
  })
  RoleSeq.belongsTo(ModeratorSeq, {
    as: 'updatedBy',
    foreignKey: 'updatedById'
  })
  RoleSeq.belongsToMany(PermissionSeq, {
    through: RolePermissionSeq,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',

  })
}, 0)

export default RoleSeq
