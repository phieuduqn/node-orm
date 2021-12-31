/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */

require('dotenv').config()
require('babel-register')

const lodash = require('lodash')
const author = require('../author/cms.author')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = []

    for (const module of author.PERMISSION_MODULE_LIST) {
      for (const ckey in author.PERMISSION) {
        const item = {
          name: `${lodash.upperFirst(ckey)}`,
          code: `${module.prefix}_${author.PERMISSION[ckey]}`,
          modulePrefix: module.prefix,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        data.push(item)
      }
    }
    await queryInterface.bulkInsert('permissions', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
