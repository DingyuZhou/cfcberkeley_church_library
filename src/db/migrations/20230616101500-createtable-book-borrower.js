'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('book_borrower', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      firstName: {
        field: 'first_name',
        type: Sequelize.TEXT,
        allowNull: false
      },
      lastName: {
        field: 'last_name',
        type: Sequelize.TEXT,
        allowNull: false
      },
      phoneNumber: {
        field: 'phone_number',
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      checkoutPasscodeHash: {
        field: 'checkout_passcode_hash',
        type: Sequelize.TEXT,
      },
      passcodeExpireAt: {
        field: 'passcode_expire_at',
        type: Sequelize.DATE,
      },
      oneTimePasswordHash: {
        field: 'one_time_password_hash',
        type: Sequelize.TEXT,
      },
      remainingRetryCount: {
        field: 'remaining_retry_count',
        type: Sequelize.INTEGER,
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
    })

    await queryInterface.addIndex('book_borrower', ['uuid'])
    await queryInterface.addIndex('book_borrower', ['first_name'])
    await queryInterface.addIndex('book_borrower', ['last_name'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('book_borrower')
  }
}
