'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('book_borrower', 'is_phone_number_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })

    await queryInterface.addIndex('book_borrower', ['is_phone_number_verified'])
  },

  down: async (queryInterface, Sequelize) => {
    // do nothing
  }
}
