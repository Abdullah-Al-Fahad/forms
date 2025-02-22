require('dotenv').config(); // Load .env

module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'form',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
