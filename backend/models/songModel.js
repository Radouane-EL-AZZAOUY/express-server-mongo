const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    author: String,
    previewUrl: String,
  },
  { timestamps: true }
);

const Song = mongoose.model('Song', songSchema);

module.exports = {
  Song,
};

