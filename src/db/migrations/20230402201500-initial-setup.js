'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
      `,
    )

    await queryInterface.sequelize.query(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `,
    )

    await queryInterface.sequelize.query(
      `
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
      `,
    )

    await queryInterface.sequelize.query(
      `
        CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
      `,
    )

    await queryInterface.sequelize.query(
      `
        SET pg_trgm.similarity_threshold = 0.00001;
      `,
    )
  },

  down: async (queryInterface, Sequelize) => {
    // do nothing
  },
}
