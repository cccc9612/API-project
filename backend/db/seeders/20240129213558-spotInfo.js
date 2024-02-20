'use strict';

const { Spot } = require('../models');

let options = { tableName: 'Spots' };
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
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '321 Pike St.',
        city: 'Seattle',
        state: 'Washington',
        country: 'USA',
        lat: -85,
        lng: 122,
        name: "Pike Place Market",
        description: "2020 Top 100 Spot",
        price: 240
      },
      {
        ownerId: 2,
        address: '456 Main St.',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: "Central Park",
        description: "Iconic urban park",
        price: 150
      },
      {
        ownerId: 3,
        address: '789 Broadway Ave.',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: "Hollywood Walk of Fame",
        description: "Famous sidewalk featuring stars' names",
        price: 160
      },
      {
        ownerId: 4,
        address: '123 Ocean Blvd.',
        city: 'Miami',
        state: 'Florida',
        country: 'USA',
        lat: 25.7617,
        lng: -80.1918,
        name: "South Beach",
        description: "Trendy beachfront area",
        price: 270
      },
      {
        ownerId: 5,
        address: '987 Elm St.',
        city: 'Chicago',
        state: 'Illinois',
        country: 'USA',
        lat: 41.8781,
        lng: -87.6298,
        name: "Millennium Park",
        description: "Famous public park featuring the Cloud Gate sculpture",
        price: 155
      },
      {
        ownerId: 6,
        address: '246 Maple Ave.',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: "Golden Gate Bridge",
        description: "Iconic suspension bridge",
        price: 365
      },
      {
        ownerId: 7,
        address: '135 Pine St.',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'USA',
        lat: 42.3601,
        lng: -71.0589,
        name: "Fenway Park",
        description: "Historic baseball stadium",
        price: 275
      },
      {
        ownerId: 8,
        address: '369 Cedar St.',
        city: 'Portland',
        state: 'Oregon',
        country: 'USA',
        lat: 45.5051,
        lng: -122.6750,
        name: "Portland Japanese Garden",
        description: "Tranquil garden featuring traditional Japanese landscaping",
        price: 145
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
      address: { [Op.in]: ['321 Pike St.', '456 Main St.', '789 Broadway Ave.', '123 Ocean Blvd.', '987 Elm St.', '246 Maple Ave.', '135 Pine St.', '369 Cedar St.'] }
    }, {})
  }
};
