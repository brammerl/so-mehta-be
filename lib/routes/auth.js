const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const sendUser= (user, res) => {
  res.cookie('session', user.authToken(), {
    httpOnly: true, 
    maxAge: ONE_DAY_IN_MS
  });
  res.send(user);
}

module.exports = Router()
  .post('/signup',(req, res, next) => {
    User
      .create(req.body)
      .then(user => sendUser(user, res))
      .catch(next);
  })
  
  .post('/login', (req, res, next) => {
    User
      .authorize(req.body.username, req.body.password)
      .then(user => sendUser(user, res))
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  });