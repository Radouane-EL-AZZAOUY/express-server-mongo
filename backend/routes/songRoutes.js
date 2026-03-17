const {
  refreshTopSongsInDatabase,
  getTopSongsFromDatabase,
} = require('../services/songService');

function registerSongRoutes(app) {
  // Fetch from Apple, store in MongoDB, return JSON
  app.get('/top10', async (req, res) => {
    try {
      const songs = await refreshTopSongsInDatabase(10);
      res.json({ ok: true, count: songs.length, songs });
    } catch (err) {
      console.error('Error in /top10:', err);
      const status = err.statusCode || 500;
      res.status(status).json({ ok: false, error: err.message });
    }
  });

  // Return top 10 songs from MongoDB only (no Apple API call)
  app.get('/top10/db', async (req, res) => {
    try {
      const songs = await getTopSongsFromDatabase(10);
      res.json({ ok: true, count: songs.length, songs });
    } catch (err) {
      console.error('Error in /top10/db:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });
}

module.exports = {
  registerSongRoutes,
};

