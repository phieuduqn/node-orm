

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
    */
    const { DataTypes } = Sequelize
    await queryInterface.createTable('moderators', {
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
        allowNull: false
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
    await queryInterface.dropTable('moderators');
  }
};
