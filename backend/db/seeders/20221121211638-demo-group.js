"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Groups";
    return queryInterface.bulkInsert(
      options,
      [
        {
          organizerId: 1,
          name: "Demos Group",
          about: "We demolish eveything. And we add extra text to ensure our about is more than 50 characters",
          type: "In person",
          private: false,
          city: "New York",
          state: "New York",
        },
        {
          organizerId: 2,
          name: "Owens Group",
          about: "We build backend APIs. And we add extra text to ensure our about is more than 50 characters",
          type: "In person",
          private: true,
          city: "Dewey Beach",
          state: "Delaware",
        },
        {
          organizerId: 3,
          name: "Chandlers Group",
          about: "We discuss and review our health specs.  And we add extra text to ensure our about is more than 50 characters",
          type: "In person",
          private: true,
          city: "Los Angeles",
          state: "California",
        }, {
          organizerId: 4,
          name: "Conners Group",
          about: "We play video games.  And we add extra text to ensure our about is more than 50 characters",
          type: "Online",
          private: false,
          city: "Boulder",
          state: "Colorado",
        },
      ],
      {}
    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {[Op.in]: ["Demos Group", "Owens Group", "Chandlers Group", "Conners Group"]}
    }, {})
  },
};
