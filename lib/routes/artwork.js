const { Router } = require('express');
const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() +file.originalname)
  }
});
const upload = multer({storage: storage});

module.exports = Router()
  .get('/', (req, res, next) => {
    Artwork
      .find(req.query)
      .lean()
      .then(artwork => {
      artwork.forEach(art => {
          delete art.__v;
        });
      res.send(artwork);
      })
      .catch(next);
  })

  .post('/upload', upload.single('artworkImage'), (req, res, next) => {
    Artwork
      .create({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        artworkImage: req.file.path
      })
      .then(artwork => res.send(artwork))
      .catch(next);
  })
