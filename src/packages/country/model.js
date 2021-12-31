import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const CountrySeq = dbConfig.define(
  'Country',
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
      allowNull: true,
    },
    dialCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currencyCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    flag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    tableName: 'countries',
  },
)

export default CountrySeq

