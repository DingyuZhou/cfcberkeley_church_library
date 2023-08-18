'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `
        ALTER TABLE item_category DROP CONSTRAINT item_category_name_key;
      `,
    )

    await queryInterface.sequelize.query(
      `
        ALTER TABLE item_category ALTER COLUMN section SET NOT NULL;
      `,
    )

    await queryInterface.sequelize.query(
      `
        ALTER TABLE item_category ADD CONSTRAINT item_category_unique_category UNIQUE (name, section, item_type_id);
      `,
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `
        ALTER TABLE item_category DROP CONSTRAINT item_category_unique_category;
      `,
    )

    await queryInterface.sequelize.query(
      `
        ALTER TABLE item_category ALTER COLUMN section DROP NOT NULL;
      `,
    )

    await queryInterface.sequelize.query(
      `
        ALTER TABLE item_category ADD CONSTRAINT item_category_name_key UNIQUE (name);
      `,
    )
  }
}
