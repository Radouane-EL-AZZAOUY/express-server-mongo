const path = require('path');

const projectRoot = process.cwd();

const DATA_DIR = process.env.DATA_DIR || path.join(projectRoot, 'data');
const PORT = process.env.PORT || 80;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/musicdb';

// Frontend directory relative to the project root (/app in the container)
const frontendDir = path.join(projectRoot, 'frontend');

module.exports = {
  DATA_DIR,
  PORT,
  MONGO_URI,
  frontendDir,
};

