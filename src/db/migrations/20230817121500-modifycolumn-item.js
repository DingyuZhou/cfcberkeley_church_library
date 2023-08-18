'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('item', ['status'])
    await queryInterface.removeColumn('item', 'status')

    await queryInterface.sequelize.query(
      `
        DROP TYPE enum_item_status;
      `,
    )

    await queryInterface.addColumn('item', 'status', {
      type: Sequelize.ENUM(['AVAILABLE', 'LENT', 'DELETED', 'MISSING']),
      allowNull: false,
      defaultValue: 'AVAILABLE'
    })
    await queryInterface.addIndex('item', ['status'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('item', ['status'])
    await queryInterface.removeColumn('item', 'status')

    await queryInterface.sequelize.query(
      `
        DROP TYPE enum_item_status;
      `,
    )

    await queryInterface.addColumn('item', 'status', {
      type: Sequelize.ENUM(['AVAILABLE', 'LENT', 'UNAVAILABLE']),
      allowNull: false,
      defaultValue: 'AVAILABLE'
    })
    await queryInterface.addIndex('item', ['status'])
  }
}
