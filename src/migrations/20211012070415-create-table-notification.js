

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { DataTypes } = Sequelize
    await queryInterface.createTable('notifications', {
      _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING, // system, target
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      labelStr: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      labels: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      titleTemplate: {
        type: DataTypes.STRING,
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
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('notification');
  }
};
