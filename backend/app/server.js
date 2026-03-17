const { PORT } = require('../config/env');
const { connectMongo } = require('../database/mongo');
const { createExpressApp } = require('./createExpressApp');

// Disable TLS verification for external HTTPS calls (e.g., iTunes RSS)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function start() {
  await connectMongo();

  const app = createExpressApp();

  app.listen(PORT, () => {
    console.log('Express server listening on port', PORT);
  });
}

module.exports = {
  start,
};

