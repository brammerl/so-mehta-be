const express = require('express');
const app = express();

app.use(require('cookie-parser')());
app.use(require('cors')({
    origin: true,
    credentials: true
  }));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/v1/artwork', require('./routes/artwork'));
app.use('/api/v1/auth', require('./routes/auth'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
