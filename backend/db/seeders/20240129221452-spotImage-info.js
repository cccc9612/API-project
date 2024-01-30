'use strict';

const { SpotImage } = require('../models');

let options = { tableName: 'SpotImages' };
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

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://sample.com/image1.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://sample.com/image2.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "https://sample.com/image3.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://sample.com/image4.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://sample.com/image5.jpg",
        preview: true,
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
      url: { [Op.in]: ["https://sample.com/image1.jpg", "https://sample.com/image2.jpg", "https://sample.com/image3.jpg", "https://sample.com/image4.jpg", "https://sample.com/image5.jpg"] }
    }, {})
  }
};
