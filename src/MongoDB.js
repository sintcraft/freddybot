const mongoose = require('mongoose');
const config = require('../config.json');
const userStats = require('./models/userStats');
class MongoDB {
   constructor() {
      mongoose.connect(process.env.MONGO_URI)
   }

   async getUserStats(id) {
      return await userStats.findOne({ id: id });
   }
   async getUserLevel(id) {
      const user = await userStats.findOne({ id: id });
      return {
         level: user.level,
         exp: user.exp
      };
   }
   async addUserStats(id, username) {
      const user = new userStats({
         id: id,
         username: username,
         exp: 0,
         level: 0
      });
      await user.save();
      return user;
   }
   async addExp(id, exp) {
      let user = await userStats.findOne({ id: id });
      if(!user) return false;
      user.exp += exp;
      if(user.exp >= 200) {
         user.exp +=  -200;
         user.level += 1;
      }
      await user.save();
      return user;
   }
   async getUserStatsAll() {
      return await userStats.find({})
   }
}

module.exports = MongoDB;