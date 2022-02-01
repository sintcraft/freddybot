const mongoose = require('mongoose');

const UserStats = new mongoose.Schema({
   username: String,
   id: String,
   exp: Number,
   level: Number,
   createdAt: {
      type: Date,
      default: Date.now
   },
})

module.exports = mongoose.model('UserStats', UserStats);