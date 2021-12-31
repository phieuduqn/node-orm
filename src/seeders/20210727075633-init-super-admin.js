

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('moderators', [{
      email: process.env.SUPER_ADMIN_EMAIL,
      fullName: process.env.SUPER_ADMIN_FULL_NAME,
      status: 1,
      roleId: process.env.SUPER_ADMIN_ROLE,
      password: process.env.SUPER_ADMIN_PASSWORD,
      _v: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('moderators', null, {});
  }
};
