const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');

async function connectMongo() {
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('Connected to MongoDB at', MONGO_URI);
}

function getMongoConnectionState() {
  return mongoose.connection.readyState;
}

module.exports = {
  connectMongo,
  getMongoConnectionState,
};

