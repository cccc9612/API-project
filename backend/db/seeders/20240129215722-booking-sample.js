'use strict';

const { Booking } = require('../models');

let options = { tableName: 'Bookings' };
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
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2024-03-15T12:00:00Z'),
        endDate: new Date('2024-03-17T12:00:00Z'),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2024-04-20T14:00:00Z'),
        endDate: new Date('2024-04-25T10:00:00Z'),
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2024-06-10T08:00:00Z'),
        endDate: new Date('2024-06-15T12:00:00Z'),
      },
      {
        spotId: 4,
        userId: 1,
        startDate: new Date('2024-08-01T16:00:00Z'),
        endDate: new Date('2024-08-03T10:00:00Z'),
      },
      {
        spotId: 5,
        userId: 3,
        startDate: new Date('2024-09-05T09:00:00Z'),
        endDate: new Date('2024-09-07T18:00:00Z'),
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
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {})
  }
};
