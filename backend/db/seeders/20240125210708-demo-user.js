'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
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
    await User.bulkCreate([
      {
        firstName: 'abc',
        lastName: 'def',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jessica',
        lastName: 'Pearson',
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Louis',
        lastName: 'Litt',
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Donna',
        lastName: 'Paulsen',
        email: 'user5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password5')
      },

      {
        firstName: 'Rachel',
        lastName: 'Zane',
        email: 'user6@user.io',
        username: 'FakeUser6',
        hashedPassword: bcrypt.hashSync('password6')
      },

      {
        firstName: 'Mike',
        lastName: 'Ross',
        email: 'user7@user.io',
        username: 'FakeUser7',
        hashedPassword: bcrypt.hashSync('password7')
      },

      {
        firstName: 'Robert',
        lastName: 'Zane',
        email: 'user8@user.io',
        username: 'FakeUser8',
        hashedPassword: bcrypt.hashSync('password8')
      },

      {
        firstName: 'Alex',
        lastName: 'Williams',
        email: 'user9@user.io',
        username: 'FakeUser9',
        hashedPassword: bcrypt.hashSync('password9')
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {})
  }
};
