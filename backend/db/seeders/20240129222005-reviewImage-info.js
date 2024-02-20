'use strict';

const { ReviewImage } = require('../models');

let options = { tableName: 'ReviewImages' };
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
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708384226/wr4cc2r2onb60mapz85y.jpg",
      },
      {
        reviewId: 1,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708384373/htayzxinucvrohq7m2rz.jpg",
      },
      {
        reviewId: 2,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708384373/xkabmyvbvi1tc8klswjr.jpg",
      },
      {
        reviewId: 3,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708384374/sycuozc8mclcygthungo.jpg",
      },
      {
        reviewId: 3,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708384375/bvmfpce8lxsucqikxzq8.jpg",
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
      url: { [Op.in]: ["https://example.com/image1.jpg", "https://example.com/image2.jpg", "https://example.com/image3.jpg", "https://example.com/image4.jpg", "https://example.com/image5.jpg"] }
    }, {})
  }
};
