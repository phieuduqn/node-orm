

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
    await queryInterface.bulkInsert('users', [{
      email: 'devzzz@gmail.com',
      fullName: 'Dev',
      isVerifiedEmail: 1,
      status: 1,
      isIdentityVerified: 0,
      password: '$2b$07$WY84b7fRiId1NjXjzgrWROctDkjanz1L3MO8WnAGLOLMq5SsGhKnK',
      _v: 1,
      isDeleted: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'mingzzz@gmail.com',
      fullName: 'Ming',
      isVerifiedEmail: 0,
      status: 0,
      isIdentityVerified: 0,
      password: '$2b$07$WY84b7fRiId1NjXjzgrWROctDkjanz1L3MO8WnAGLOLMq5SsGhKnK',
      _v: 1,
      isDeleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
