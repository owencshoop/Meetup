"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Venues";
    return queryInterface.bulkInsert(options, [
      {
        id: 1,
        groupId: 1,
        address: "123 Group One St",
        city: "New York",
        state: "New York",
        lat: "12.1231231",
        lng: "12.1241243",
      },
      {
        id: 2,
        groupId: 2,
        address: "234 Group Two St",
        city: "Dewey Beach",
        state: "Delaware",
        lat: "23.23423",
        lng: "23.23423",
      },
      {
        id: 3,
        groupId: 3,
        address: "345 Group Three St",
        city: "Los Angeles",
        state: "California",
        lat: "34.1231231",
        lng: "34.1241243",
      },
      {
        id: 4,
        groupId: 4,
        address: "456 Group Four St",
        city: "Boulder",
        state: "Colorado",
        lat: "45.1231231",
        lng: "45.1241243",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] },
    });
  },
};
