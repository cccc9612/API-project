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
        spotId: 1,
        userId: 2,
        startDate: new Date('2024-03-20T14:00:00Z'),
        endDate: new Date('2024-03-22T10:00:00Z'),
      },

      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2024-03-25T09:00:00Z'),
        endDate: new Date('2024-03-27T09:00:00Z'),
      },

      {
        spotId: 2,
        userId: 4,
        startDate: new Date('2024-04-01T12:00:00Z'),
        endDate: new Date('2024-04-03T12:00:00Z'),
      },

      {
        spotId: 4,
        userId: 5,
        startDate: new Date('2024-04-05T15:00:00Z'),
        endDate: new Date('2024-04-07T10:00:00Z'),
      },

      {
        spotId: 5,
        userId: 6,
        startDate: new Date('2024-04-10T10:00:00Z'),
        endDate: new Date('2024-04-12T16:00:00Z'),
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
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {})
  }
};
