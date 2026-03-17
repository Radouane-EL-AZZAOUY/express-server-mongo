const express = require('express');
const path = require('path');
const { frontendDir } = require('../config/env');
const { registerSongRoutes } = require('../routes/songRoutes');
const { registerFormRoutes } = require('../routes/formRoutes');

function createExpressApp() {
  const app = express();

  app.use(express.json());

  app.use(express.static(frontendDir));

  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDir, 'index.html'));
  });

  registerSongRoutes(app);
  registerFormRoutes(app);

  return app;
}

module.exports = {
  createExpressApp,
};

