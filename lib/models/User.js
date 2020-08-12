require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { schema } = require('./Artwork');


const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  passwordHash: {type: String, required: true},
  profileImage: { type: String, required: true}
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.passwordHash;
    }
  }
});

userSchema.virtual('password').set(function(plainTextPassword){
  const passwordHash = bcrypt.hashSync(plainTextPassword, + process.env.SALT_ROUNDS);
  this.passwordHash = passwordHash;
})

userSchema.statics.authorize = async function(username, password) {
  const user = await this.findOne({ username })
  if(!user) {
    const error = new Error('Invalid email/password');
    error.status = 401;
    throw error;
  }

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
  if(!passwordsMatch) {
    const error = new Error('Invalid email/password');
    error.status = 401;
    throw error;
  }

  return user;
};

userSchema.methods.authToken = function() {
  const token = jwt.sign({ sub: this.toJSON() }, process.env.APP_SECRET, {
    expiresIn: '24h'
  });
  return token;
};

userSchema.statics.tokenToUser = function(token) {
  try {
    const { sub } = jwt.verify(token, process.env.APP_SECRET);
    return this.hydrate(sub);
  } catch {
    const error = new Error(`Invalid or missing token: ${token}`);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);