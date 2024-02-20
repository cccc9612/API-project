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
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708382457/zl7maqlcvacsucb5psdl.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406280/home%20images/apssstg04nhgohkx6cco.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406280/home%20images/miyj9aicbhyd4ryfzsfg.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406281/home%20images/p82vthzty8qgs6b9xksh.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406281/home%20images/lkhy6oyqtpqlnqxrdqgw.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383760/gwf204z7tvqwg1a5aaxc.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406281/home%20images/pe3dyeidcrzojmzfpygp.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406281/home%20images/mndsojwcjwxamdxn5kxu.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406282/home%20images/dtfxhwueef1alogo6qnp.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406283/home%20images/gjcq0nfu0bicshzpfrai.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383420/wi4exvfpvnlvca9adjlz.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406283/home%20images/lek6s2mwwix6gw4lbwr7.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406283/home%20images/mhfuqkvie4x1u7y2ysu5.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406284/home%20images/xpkacbncxx5spcacpbwt.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406284/home%20images/yaom4ob0wcno7ovrd8bh.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708384226/gee5tskun83yvj3rlc37.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406284/home%20images/j7mbgafcjuvmetecahw2.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406284/home%20images/zlbuixbd6x5jicxkilrt.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406285/home%20images/dlhvvueznzy5hbnjqdw1.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406285/home%20images/fmbiopyldhqsivvj3vfg.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383556/cg91dd4vm1lhieo9wjvp.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406286/home%20images/orbckzvhqekuuodgrpi1.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406286/home%20images/kyya2vtgliwiehlgxnwf.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406286/home%20images/bgoehpsotza0ekoi7jtv.png",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406287/home%20images/mxsizajrftycj2grujep.jpg",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383638/p5ezqhmwkgqowaqaousi.jpg",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406287/home%20images/csx12x6dgpcm9gzmzm4h.jpg",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406288/home%20images/i53sdpliumh8v5xef1os.jpg",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406288/home%20images/nf9wst5judh9eguoq3js.jpg",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406289/home%20images/evycdnt1jqq5azlwyo0h.jpg",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383760/v5q5na5r4q69jo1atc6z.jpg",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406290/home%20images/lxufoskzl839ichthls1.jpg",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406290/home%20images/fvtvqzbb0dt7rvcuzt5x.jpg",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406290/home%20images/hgsdkpsdswivpu8v8c7s.jpg",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406290/home%20images/xraqwmsv8jt07s8ph5jz.jpg",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383760/bnuxoe1bdv6bmaozh5g1.jpg",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406290/home%20images/pac3fkqghomugfrrzscc.jpg",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406291/home%20images/l9wwoe7fqjjlqnpjhhwh.jpg",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406291/home%20images/dis0cdshi9dvepfwnijp.jpg",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708406292/home%20images/xdlddozsf9vesy7e0iry.jpg",
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
      url: {
        [Op.in]: ["https://res.cloudinary.com/dcjacsnm3/image/upload/v1708382457/zl7maqlcvacsucb5psdl.jpg",
          "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383760/gwf204z7tvqwg1a5aaxc.jpg",
          "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383420/wi4exvfpvnlvca9adjlz.jpg",
          "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708384226/gee5tskun83yvj3rlc37.jpg",
          "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383556/cg91dd4vm1lhieo9wjvp.jpg",
          "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383638/p5ezqhmwkgqowaqaousi.jpg",
          "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383760/v5q5na5r4q69jo1atc6z.jpg",
          "https://res.cloudinary.com/dcjacsnm3/image/upload/v1708383760/bnuxoe1bdv6bmaozh5g1.jpg"]
      }
    }, {})
  }
};
