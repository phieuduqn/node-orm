import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const UserAccessSeq = dbConfig.define(
  'UserAccess',
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
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
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
    tableName: 'user_access',
  },
)


export default UserAccessSeq

