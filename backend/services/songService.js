const { parseStringPromise } = require('xml2js');
const { Song } = require('../models/songModel');

async function fetchTopSongsFromApple(limit = 10) {
  const base =
    'ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=' +
    limit +
    '/xml';
  const url = 'https://' + base;

  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('Upstream error: ' + response.status);
    error.statusCode = 502;
    throw error;
  }

  const xmlText = await response.text();
  const parsed = await parseStringPromise(xmlText, { explicitArray: false });

  const entries =
    parsed?.feed?.entry && Array.isArray(parsed.feed.entry)
      ? parsed.feed.entry
      : parsed?.feed?.entry
      ? [parsed.feed.entry]
      : [];

  return entries.map((entry) => {
    const title =
      (entry.title && entry.title._) ||
      (typeof entry.title === 'string' ? entry.title : 'Unknown');

    let image = '';
    const images = entry['im:image'];
    if (Array.isArray(images) && images.length > 0) {
      image = images[images.length - 1]._;
    } else if (images && images._) {
      image = images._;
    }

    let author = '';
    if (entry.author) {
      if (entry.author.name && entry.author.name._) {
        author = entry.author.name._;
      } else if (typeof entry.author === 'string') {
        author = entry.author;
      }
    }

    return { title: title || 'Unknown', image: image || '', author: author || '' };
  });
}

async function refreshTopSongsInDatabase(limit = 10) {
  const songs = await fetchTopSongsFromApple(limit);
  await Song.deleteMany({});
  await Song.insertMany(songs);
  return songs;
}

async function getTopSongsFromDatabase(limit = 10) {
  const songs = await Song.find().limit(limit).lean();
  return songs;
}

module.exports = {
  fetchTopSongsFromApple,
  refreshTopSongsInDatabase,
  getTopSongsFromDatabase,
};

