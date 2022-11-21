'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo',
        lastName: 'Lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'owen@user.io',
        username: 'owen',
        firstName: 'Owen',
        lastName: 'Nunya',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'chandler@user.io',
        firstName: 'Chandler',
        lastName: 'Lastname',
        username: 'chandler',
        hashedPassword: bcrypt.hashSync('password3')
      }, {
        email: 'conner@user.io',
        firstName: 'Conner',
        lastName: 'Shoop',
        username: 'conner',
        hashedPassword: bcrypt.hashSync('password4')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'owen', 'chandler'] }
    }, {});
  }
};
