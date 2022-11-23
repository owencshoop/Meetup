'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

   options.tableName = 'Events'
   return queryInterface.bulkInsert(options, [
    {
      venueId: 1,
      groupId: 1,
      name: 'Demos event',
      description: 'Demos group 1 venue 1 event',
      type: 'In person',
      capacity: 20,
      price: 200,
      startDate: "2022-11-19 20:00:00",
      endDate: "2022-12-31 20:00:00"
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Owens event',
      description: 'Owens group 2 venue 2 event',
      type: 'In person',
      capacity: 20,
      price: 200,
      startDate: "2022-11-19 20:00:00",
      endDate: "2022-12-31 20:00:00"
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Chandlers event',
      description: 'Chandlers group 3 venue 3 event',
      type: 'In person',
      capacity: 20,
      price: 200,
      startDate: "2022-11-19 20:00:00",
      endDate: "2022-12-31 20:00:00"
    },
    {
      venueId: 4,
      groupId: 4,
      name: 'Conners event',
      description: 'Conners group 4 venue 4 event',
      type: 'Online',
      capacity: 20,
      price: 200,
      startDate: "2022-11-19 20:00:00",
      endDate: "2022-12-31 20:00:00"
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] },
    });
  }
};
