'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('item', 'borrowed_at', 'lent_at')

    await queryInterface.addColumn('item', 'status', {
      type: Sequelize.ENUM(['AVAILABLE', 'LENT', 'UNAVAILABLE']),
      allowNull: false,
      defaultValue: 'AVAILABLE'
    })
    await queryInterface.addIndex('item', ['status'])

    await queryInterface.addColumn('item', 'borrower_id', {
      type: Sequelize.BIGINT,
      references: { model: 'book_borrower', key: 'id' },
    })
    await queryInterface.addIndex('item', ['borrower_id'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('item', ['borrower_id'])
    await queryInterface.removeColumn('item', 'borrower_id')

    await queryInterface.removeIndex('item', ['status'])
    await queryInterface.removeColumn('item', 'status')

    await queryInterface.renameColumn('item', 'lent_at', 'borrowed_at')
  }
}
