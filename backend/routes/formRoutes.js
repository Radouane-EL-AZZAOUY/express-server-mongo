const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/env');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function registerFormRoutes(app) {
  app.post('/submit', (req, res) => {
    try {
      ensureDataDir();
      const data = req.body;
      const filename = `data-${Date.now()}.json`;
      const filepath = path.join(DATA_DIR, filename);
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
      res.json({ ok: true, file: filename });
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });
}

module.exports = {
  registerFormRoutes,
};

