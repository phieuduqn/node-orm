import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const VerifyEmailSeq = dbConfig.define(
  'VerifyEmail',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiredTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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
    tableName: 'verify_email',
  },
)


export default VerifyEmailSeq

