const { Router } = require('express');
// const multer = require('multer');
const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');


// const storage = multer.diskStorage({
//   destination: function(req, file, cb){
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb){
//     cb(null, file.originalname);
//   }
// })

// const upload = multer({storage: storage})

// const fileFilter = (req, file, cb) => {
//   if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// }
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

  .post('/upload', (req, res, next) => {
    Artwork
      .create({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        artworkImage: req.body.artworkImage
      })
      .then(artwork => res.send(artwork))
      .catch(next);
  })
