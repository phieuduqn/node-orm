

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     * */
    const { DataTypes } = Sequelize
    await queryInterface.createTable(
      'verify_email',
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
          type: DataTypes.INTEGER
        },
        expiredTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
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
      }
    );
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable('verify_email');
  }
};
