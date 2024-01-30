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
        price: 40
      },
      {
        ownerId: 2,
        address: '1551 Plain Road',
        city: 'Santa Ana',
        state: 'Ontario',
        country: 'Canada',
        lat: 12.5,
        lng: 93,
        name: "Oshi",
        description: "chill and memorable",
        price: 388.88
      },
      {
        ownerId: 2,
        address: '156 Diamond Blvd.',
        city: 'Charlotte',
        state: 'North Carolina',
        country: 'USA',
        lat: 1.92,
        lng: -60,
        name: "Cool Cool Cool",
        description: "Close to downtown",
        price: 299
      },
      {
        ownerId: 4,
        address: '9 Canyon Street',
        city: 'Basil City',
        state: 'Florida',
        country: 'USA',
        lat: -9.0,
        lng: 15.2,
        name: "Santa Club",
        description: "Great for large groups",
        price: 745.50
      },
      {
        ownerId: 3,
        address: '57 Big Bear Avenue',
        city: 'Big Bear City',
        state: 'California',
        country: 'USA',
        lat: 5,
        lng: -179.9,
        name: "Playground#1",
        description: "Hot and New",
        price: 999.99
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
      address: { [Op.in]: ['1 apple st.', '1551 Plain Road', '156 Diamond Blvd.', '9 Canyon Street', '57 Big Bear Avenue'] }
    }, {})
  }
};
