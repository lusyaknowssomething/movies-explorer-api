require('dotenv').config();

const {
  PORT = 3000,
  MONGODB_ADDRESS = 'mongodb://localhost:27017/moviesdb',
} = process.env;

module.exports = { PORT, MONGODB_ADDRESS };
