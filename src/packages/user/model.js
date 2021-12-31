import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import method from './method'
import config from './config'
import { UserSocialSeq } from '../../models'

const UserSeqFactory = () => {
  return dbConfig.define(
    'User',
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
      accountType: {
        type: DataTypes.STRING,
        defaultValue: config.accountType.normal,
        allowNull: false,
      },
      socialId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fullName: {
        type: DataTypes.STRING,
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
      isVerifiedEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: config.status.inactive,
        allowNull: false
      },
      identityBefore: {
        type: DataTypes.STRING,
        allowNull: true
      },
      identityAfter: {
        type: DataTypes.STRING,
        allowNull: true
      },
      identityImageWithOtp: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verifyIdentityOTP: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isIdentityVerified: {
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
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
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
      tableName: 'users',
      indexes: [
      // Create a unique index on email
        {
          unique: true,
          fields: ['email']
        },
        {
          fields: ['status'],
        },
      ]
    },
  )
}
const UserSeq = UserSeqFactory()
UserSeq.beforeCreate((user) => {
  user.password = method.hashPassword(user.password)
  return true
})
setTimeout(() => {
  UserSeq.hasMany(UserSocialSeq, {
    as: 'socials',
    foreignKey: 'userId'
  })

  // UserSeq.belongsTo(CountrySeq, {
  //   as: 'country',
  //   foreignKey: 'countryId'
  // })
}, 0)

export default UserSeq
