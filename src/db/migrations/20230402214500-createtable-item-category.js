'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_category', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      itemTypeId: {
        field: 'item_type_id',
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'item_type', key: 'id' },
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      libraryNumber: {
        field: 'library_number',
        type: Sequelize.TEXT,
      },
      section: {
        type: Sequelize.TEXT,
      },
      location: {
        type: Sequelize.TEXT,
      },
      details: {
        type: Sequelize.JSONB,
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      }
    });

    await queryInterface.addIndex('item_category', ['item_type_id'])
    await queryInterface.addIndex('item_category', ['library_number'])
    await queryInterface.addIndex('item_category', ['section'])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_category');
  }
};
