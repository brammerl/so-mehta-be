const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true},
  description: { type: String, required: true},
  artworkImage: { type: String, required: true}
});

module.exports = mongoose.model('Artwork', artworkSchema);