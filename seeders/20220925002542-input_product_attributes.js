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
      "Products",
      [
        {
          product_id: "CLOSE UP GREEN 160GR",
          expired: new Date("2023-03-28"),
          stock: 100,
          profit: 3000,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "CLEAN&CLEAR MICELLAR WATER",
          expired: new Date("2023-05-28"),
          stock: 200,
          profit: 500,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "TAS KAIN 30X40 LARGE",
          expired: new Date("2023-07-21"),
          stock: 20,
          profit: 100,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "COCA COLA 1LT",
          expired: new Date("2024-03-28"),
          stock: 200,
          profit: 5000,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "LARUTAN CAP BADAK LECI",
          expired: new Date("2023-09-12"),
          stock: 20,
          profit: 500,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "PHIA CITA PUTRI",
          expired: new Date("2025-03-28"),
          stock: 100,
          profit: 200,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "ES TUBE 5KG",
          expired: new Date("2022-11-28"),
          stock: 20,
          profit: 700,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "AQUA GALON 19LT",
          expired: new Date("2022-12-28"),
          stock: 100,
          profit: 50,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "CIPTEDENT FRESH 120GR",
          expired: new Date("2023-02-03"),
          stock: 20,
          profit: 700,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          product_id: "ULTRA MILK FULL CREAM",
          expired: new Date("2022-12-28"),
          stock: 200,
          profit: 700,
          status: true,
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
    await queryInterface.bulkDelete("Products", null, {
      restartIdentity: true,
    });
  },
};
