const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
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

userSchema.statics.authorize = async function(email, password) {
  const user = await this.findOne({ email })
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
}
module.exports = mongoose.model('User', userSchema);