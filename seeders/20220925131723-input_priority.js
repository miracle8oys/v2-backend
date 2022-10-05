"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Priorities",
      [
        {
          attribute: "stock",
          priority: 35,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          attribute: "profit",
          priority: 35,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          attribute: "expired",
          priority: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Priorities", null, {
      restartIdentity: true,
    });
  },
};
