import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { UserSeq } from '../../models'

const NotificationFactory = () => {
  return dbConfig.define(
    'Notification',
    {
      _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: 'Notification',
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING, // system, target
        defaultValue: 'target',
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      labels: {
        type: DataTypes.JSON,
        allowNull: true
      },
      titleTemplate: {
        type: DataTypes.STRING,
        defaultValue: 'Notification',
        allowNull: true,
      },
      messageTemplate: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      params: { // Params to add to message. It dependent key
        type: DataTypes.JSON,
        allowNull: true
      },
      fromId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      toId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      referAction: {
        type: DataTypes.STRING,
        allowNull: true
      },
      referType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      referValue: {
        type: DataTypes.STRING,
        allowNull: true
      },
      read: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      updatedById: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
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
      tableName: 'notifications',
    }
  )
}

const NotificationSeq = NotificationFactory()

setTimeout(() => {
  NotificationSeq.belongsTo(UserSeq, {
    foreignKey: 'fromId',
    as: 'from',
    attributes: ['_id', 'avatar', 'fullName']
  })
  NotificationSeq.belongsTo(UserSeq, {
    foreignKey: 'toId',
    as: 'to',
    attributes: ['_id', 'avatar', 'fullName']
  })
}, 0)

export default NotificationSeq

