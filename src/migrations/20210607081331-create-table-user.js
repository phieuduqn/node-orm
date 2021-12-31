

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
    */
    const { DataTypes } = Sequelize
    await queryInterface.createTable('users', {
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
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      accountType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      socialId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      identityBefore: {
        type: DataTypes.STRING,
        allowNull: true
      },
      identityAfter: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verifyIdentityOTP: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      identityImageWithOtp: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isIdentityVerified: {
        type: DataTypes.BOOLEAN,
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
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      },
      updatedAt:
      {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
      }
    });
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable('users');
  }
};
