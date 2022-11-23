'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: 'event1sampleurl.com',
        preview: true
      },
      {
        eventId: 2,
        url: 'event2sampleurl.com',
        preview: true
      },
      {
        eventId: 3,
        url: 'event3sampleurl.com',
        preview: true
      },
      {
        eventId: 4,
        url: 'event4sampleurl.com',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] },
    });
  }
};
