import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const SettingSeqFactory = () => {
  return dbConfig.define(
    'Setting',
    {
      _id: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        primaryKey: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      senderEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      social: {
        type: DataTypes.JSON,
        allowNull: true,
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
      tableName: 'settings',
    }
  )
}
const SettingSeq = SettingSeqFactory()

export default SettingSeq

