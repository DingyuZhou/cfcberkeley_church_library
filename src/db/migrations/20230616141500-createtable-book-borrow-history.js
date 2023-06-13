'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'book_borrow_history',
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        borrowerId: {
          field: 'borrower_id',
          type: Sequelize.BIGINT,
          references: { model: 'book_borrower', key: 'id' },
          allowNull: false,
          unique: 'unique_data',
        },
        itemId: {
          field: 'item_id',
          type: Sequelize.BIGINT,
          references: { model: 'item', key: 'id' },
          allowNull: false,
          unique: 'unique_data',
        },
        borrowedAt: {
          field: 'borrowed_at',
          type: Sequelize.DATE,
          allowNull: false,
          unique: 'unique_data',
        },
        returnedAt: {
          field: 'returned_at',
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
      },
      {
        uniqueKeys: {
          unique_data: {
            fields: [
              'borrower_id',
              'item_id',
              'borrowed_at',
            ],
          },
        },
      },
    )

    await queryInterface.addIndex('book_borrow_history', ['item_id'])
    await queryInterface.addIndex('book_borrow_history', ['borrowed_at'])
    await queryInterface.addIndex('book_borrow_history', ['returned_at'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('book_borrow_history')
  }
}
