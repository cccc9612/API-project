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
        userId: 1,
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
        spotId: 1,
        userId: 3,
        review: "Decent place.",
        stars: 2,
      },
      {
        spotId: 2,
        userId: 2,
        review: "Disappointed and won't be returning.",
        stars: 1,
      },
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
