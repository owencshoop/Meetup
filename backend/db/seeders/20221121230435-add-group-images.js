'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: 'group1sampleurl.com',
        preview: true
      },
      {
        groupId: 2,
        url: 'group2sampleurl.com',
        preview: true
      },
      {
        groupId: 3,
        url: 'group3sampleurl.com',
        preview: true
      },
      {
        groupId: 4,
        url: 'group4sampleurl.com',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] },
    });
  }
};
