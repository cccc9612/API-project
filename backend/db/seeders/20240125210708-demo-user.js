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
        firstName: 'Lauren',
        lastName: 'Richard',
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
        firstName: 'Amanda',
        lastName: 'Johnson',
        email: 'ajohnson@example.com',
        username: 'mandyjohnson',
        hashedPassword: bcrypt.hashSync('SecureP@ss')
      },
      {
        firstName: 'Donna',
        lastName: 'Paulsen',
        email: 'user5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password5')
      },

      {
        firstName: 'Christopher',
        lastName: 'Taylor',
        email: 'chris.taylor@gmail.com',
        username: 'ChrisTaylor1982',
        hashedPassword: bcrypt.hashSync('TaylorMade1982')
      },

      {
        firstName: 'Brandon',
        lastName: 'Wong',
        email: 'bwong@company.com',
        username: 'brandonw',
        hashedPassword: bcrypt.hashSync('WongIsKing!')
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
      },
      {
        firstName: 'Sophia',
        lastName: 'Martinez',
        email: 'sophia.martinez@example.org',
        username: 'sophiamtz',
        hashedPassword: bcrypt.hashSync('Martinez@2023')
      },
      {
        firstName: 'Jessica',
        lastName: 'Brown',
        email: 'jess_brown123@gmail.com',
        username: 'jessbrown',
        hashedPassword: bcrypt.hashSync('Brownie2024!')
      },
      {
        firstName: 'Rachel',
        lastName: 'Lopez',
        email: 'rachel.lopez@example.org',
        username: 'r_lopez',
        hashedPassword: bcrypt.hashSync('LopezR2024!')
      },
      {
        firstName: 'Jack',
        lastName: 'Long',
        email: 'jack.long@example.net',
        username: 'jacklong',
        hashedPassword: bcrypt.hashSync('LongJack123#')
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {})
  }
};
