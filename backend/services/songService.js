const { parseStringPromise } = require('xml2js');
const { Song } = require('../models/songModel');

function extractTrackId(entry) {
  const raw = entry['im:id'];
  if (raw) {
    const val = typeof raw === 'object' ? raw._ : raw;
    if (val && /^\d+$/.test(String(val).trim())) return String(val).trim();
  }

  const idField = entry.id;
  const idUrl = idField && (typeof idField === 'object' ? idField._ : idField);
  if (idUrl && typeof idUrl === 'string') {
    const match = idUrl.match(/[?&]i=(\d+)/);
    if (match) return match[1];
    const pathMatch = idUrl.match(/\/(\d{8,})$/);
    if (pathMatch) return pathMatch[1];
  }

  return null;
}

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

  const trackIds = entries.map(extractTrackId).filter(Boolean);
  console.log('[songService] extracted trackIds:', trackIds);

  let previewMap = {};
  if (trackIds.length > 0) {
    try {
      const lookupUrl =
        'https://itunes.apple.com/lookup?id=' +
        trackIds.join(',') +
        '&entity=song&country=us';
      const lookupRes = await fetch(lookupUrl);
      if (lookupRes.ok) {
        const lookupData = await lookupRes.json();
        console.log('[songService] iTunes lookup results count:', lookupData.resultCount);
        (lookupData.results || []).forEach((r) => {
          if (r.previewUrl) {
            // index by trackId or collectionId
            const id = r.trackId || r.collectionId;
            if (id) previewMap[String(id)] = r.previewUrl;
          }
        });
      }
    } catch (e) {
      console.warn('[songService] preview lookup failed:', e.message);
    }
  }

  console.log('[songService] previewMap keys:', Object.keys(previewMap));

  return entries.map((entry) => {
    const rawName = entry['im:name'];
    const rawTitle = entry.title;
    const title =
      (rawName && (typeof rawName === 'object' ? rawName._ : rawName)) ||
      (rawTitle && (typeof rawTitle === 'object' ? rawTitle._ : rawTitle)) ||
      'Unknown';

    let image = '';
    const images = entry['im:image'];
    if (Array.isArray(images) && images.length > 0) {
      image = images[images.length - 1]._;
    } else if (images && images._) {
      image = images._;
    }

    let author = '';
    const rawArtist = entry['im:artist'];
    if (rawArtist) {
      author = typeof rawArtist === 'object' ? (rawArtist._ || '') : rawArtist;
    }
    if (!author && entry.author) {
      if (entry.author.name) {
        const n = entry.author.name;
        author = typeof n === 'object' ? (n._ || '') : n;
      } else if (typeof entry.author === 'string') {
        author = entry.author;
      }
    }

    const trackId = extractTrackId(entry);
    const previewUrl = trackId ? (previewMap[String(trackId)] || '') : '';

    return { title: title || 'Unknown', image: image || '', author: author || '', previewUrl };
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

