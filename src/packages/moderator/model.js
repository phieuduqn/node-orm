import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import method from './method'
import config from './config'
import { RoleSeq } from '../../models'

const ModeratorSeqFactory = () => {
  return dbConfig.define(
    'Moderator',
    {
      _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: config.status.active,
        allowNull: false
      },
      allowSystemMessage: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      _v: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true
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
      tableName: 'moderators',
      indexes: [
      // Create a unique index on email
        {
          unique: true,
          fields: ['email']
        },
        {
          fields: ['roleId'],
        },
      ]
    },
  )
}
const ModeratorSeq = ModeratorSeqFactory()
ModeratorSeq.beforeCreate((user) => {
  user.password = method.hashPassword(user.password)
  return true
})

setTimeout(() => {
  ModeratorSeq.belongsTo(ModeratorSeq, {
    as: 'createdBy',
    foreignKey: 'createdById'
  })
  ModeratorSeq.belongsTo(ModeratorSeq, {
    as: 'updatedBy',
    foreignKey: 'updatedById'
  })
  ModeratorSeq.belongsTo(RoleSeq, {
    as: 'role',
    foreignKey: 'roleId'
  })
}, 0)

export default ModeratorSeq
