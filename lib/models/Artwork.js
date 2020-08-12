const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true},
  description: { type: String, required: true},
  artworkImage: { type: String, required: true}
});

module.exports = mongoose.model('Artwork', artworkSchema);