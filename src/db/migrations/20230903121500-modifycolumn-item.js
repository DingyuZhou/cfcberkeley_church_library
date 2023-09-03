'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `
        ALTER TYPE enum_item_status RENAME VALUE 'LENT' TO 'BORROWED';
      `,
    )

    await queryInterface.renameColumn('item', 'lent_at', 'borrowed_at')
    await queryInterface.addIndex('item', ['borrowed_at'])

    await queryInterface.addColumn('item', 'due_at', {
      type: Sequelize.DATE,
    })

    await queryInterface.addColumn('item', 'has_renewed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    // do nothing
  }
}
