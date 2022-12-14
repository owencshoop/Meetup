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
        url: 'https://media.istockphoto.com/id/1346125184/photo/group-of-successful-multiethnic-business-team.jpg?s=612x612&w=0&k=20&c=5FHgRQZSZed536rHji6w8o5Hco9JVMRe8bpgTa69hE8=',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://media.istockphoto.com/id/1272744431/photo/theyre-ready-to-push-towards-success-with-tenacity-and-confidence.jpg?s=612x612&w=0&k=20&c=H-e_iD5k3NK9PrzVFZWPM8TXCLmW4nv88B9PxqmZlys=',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://media.istockphoto.com/id/175742908/photo/team-positivity.jpg?s=612x612&w=0&k=20&c=EPVM3kSQ6GVG32KS11ZZchczbAtRFl-GMMU37Hpewvw=',
        preview: true
      },
      {
        eventId: 4,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbO-CPc6gr8ENPe_Q0gdh-WKWhjjWUwtU4Sg&usqp=CAU',
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
