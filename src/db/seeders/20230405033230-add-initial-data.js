'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('item_type', [{ id: 1, name: 'Book' }]);
    await queryInterface.bulkInsert('item_category', [{ id: -1, name: 'Uncategorized Book', 'library_number': '0', section: '0 - Uncategorized', 'item_type_id': 1 }]);
    await queryInterface.sequelize.query(
      `
        INSERT INTO member (first_name, last_name, email, password_hash, role, created_at, updated_at)
        VALUES ('Admin', 'Temporary', TRIM(LOWER('admin@cfcberkeley')), CRYPT('password@cfcberkeley', GEN_SALT('bf')), 'ADMIN', NOW(), NOW());
      `
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('item_type', { name: 'Book' });
    await queryInterface.bulkDelete('item_category', { name: 'Uncategorized Book' });
    await queryInterface.bulkDelete('member', { email: 'admin@cfcberkeley' });
  }
};
