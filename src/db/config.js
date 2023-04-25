module.exports = {
  development: {
    dialect: 'postgres',
    use_env_variable: 'DEV_DB_URL',
    logging: console.log,
    LOG_SQL: false,
  },

  test: {
    dialect: 'postgres',
    use_env_variable: 'TEST_DB_URL',
    logging: false,
    LOG_SQL: false,
  },

  production: {
    dialect: 'postgres',
    use_env_variable: 'PRD_DB_URL',
    logging: false,
    LOG_SQL: false,
  }
}
