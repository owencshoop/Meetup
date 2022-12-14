'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Memberships'
    return queryInterface.bulkInsert(
      options, [
        {
          userId: 1,
          groupId: 2,
          status: 'member'
        },
        {
          userId: 2,
          groupId: 3,
          status: 'member'
        },
        {
          userId: 3,
          groupId: 4,
          status: 'member'
        },
        {
          userId: 4,
          groupId: 1,
          status: 'member'
        },
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     options.tableName = 'Memberships'
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options, {
      id: {[Op.in]: [1, 2, 3, 4]}
     })
  }
};
