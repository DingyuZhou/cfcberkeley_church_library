'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('member_session', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      secretHash: {
        field: 'secret_hash',
        type: Sequelize.TEXT,
        allowNull: false,
      },
      memberId: {
        field: 'member_id',
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'member', key: 'id' },
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addIndex('member_session', ['member_id'])
    await queryInterface.addIndex('member_session', ['created_at'])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('member_session');
  }
};
