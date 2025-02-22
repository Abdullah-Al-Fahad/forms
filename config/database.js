const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,        // Database name
  process.env.DB_USER,        // Username
  process.env.DB_PASSWORD,    // Password
  {
    host: process.env.DB_HOST, // Hostname
    port: process.env.DB_PORT, // Port
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Allow self-signed certs (Render needs this)
      },
    },
    logging: false, // Disable logging (optional)
  }
);

module.exports = sequelize;
