import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { ModeratorSeq } from '../../models'
import config from './config'

const PermissionSeq = dbConfig.define(
  'Permission',
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modulePrefix: {
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
    tableName: 'permissions',
  },
)

setTimeout(() => {
  PermissionSeq.belongsTo(ModeratorSeq, {
    as: 'createdBy',
    foreignKey: 'createdById'
  })
  PermissionSeq.belongsTo(ModeratorSeq, {
    as: 'updatedBy',
    foreignKey: 'updatedById'
  })
}, 0)

export default PermissionSeq
