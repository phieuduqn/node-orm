import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import stringUtil from '../../utils/stringUtil'
import { UserSeq } from '../../models'

const UserSocialFactory = () => {
  return dbConfig.define(
    'UserSocial',
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
      alias: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      socialId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profileLink: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
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
      tableName: 'user_social',
    }
  )
}

const UserSocial = UserSocialFactory()
UserSocial.beforeCreate((data) => {
  if (!data.alias) {
    data.alias = stringUtil.changeAlias(data.name)
  }

  return true
})
setTimeout(() => {
  UserSocial.belongsTo(UserSeq, {
    as: 'user',
    foreignKey: 'userId'
  })
}, 0)

export default UserSocial

