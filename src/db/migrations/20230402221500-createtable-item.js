'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        field: 'uuid',
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      itemTypeId: {
        field: 'item_type_id',
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'item_type', key: 'id' },
      },
      itemCategoryId: {
        field: 'item_category_id',
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'item_category', key: 'id' },
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author: {
        type: Sequelize.TEXT,
      },
      translator: {
        type: Sequelize.TEXT,
      },
      publisher: {
        type: Sequelize.TEXT,
      },
      libraryNumber: {
        field: 'library_number',
        type: Sequelize.TEXT,
      },
      url: {
        type: Sequelize.TEXT,
      },
      releasedAt: {
        field: 'released_at',
        type: Sequelize.DATE,
      },
      note: {
        type: Sequelize.TEXT,
      },
      details: {
        type: Sequelize.JSONB,
      },
      borrowedAt: {
        field: 'borrowed_at',
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('item', ['item_type_id'])
    await queryInterface.addIndex('item', ['item_category_id'])
    await queryInterface.addIndex('item', ['title'])
    await queryInterface.addIndex('item', ['author'])
    await queryInterface.addIndex('item', ['translator'])
    await queryInterface.addIndex('item', ['publisher'])
    await queryInterface.addIndex('item', ['library_number'])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item');
  }
};
