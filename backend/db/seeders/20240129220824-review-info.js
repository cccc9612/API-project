'use strict';

const { Review } = require('../models');

let options = { tableName: 'Reviews' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 3,
        review: "Great experience, loved the location!",
        stars: 4,
      },
      {
        spotId: 2,
        userId: 2,
        review: "The amenities were fantastic, but the noise level was too high.",
        stars: 3,
      },
      {
        spotId: 3,
        userId: 3,
        review: "Wonderful stay, everything was perfect!",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 4,
        review: "Had a pleasant stay, everything was clean and tidy.",
        stars: 4,
      },
      {
        spotId: 4,
        userId: 5,
        review: "Good location, comfortable amenities.",
        stars: 4,
      },
      {
        spotId: 5,
        userId: 2,
        review: "Poor service, staff were unresponsive to complaints.",
        stars: 1,
      },
      {
        spotId: 6,
        userId: 7,
        review: "Decent spot, could use some improvement.",
        stars: 3,
      },
      {
        spotId: 7,
        userId: 8,
        review: "Enjoyed my stay, but noise level was a bit high.",
        stars: 2,
      }
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {})
  }
};
