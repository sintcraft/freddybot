require('dotenv').config();
const { Client, Intents, MessageEmbed } = require('discord.js');
const config = require('../config.json')
var MongoDB = require('./MongoDB');
MongoDB = new MongoDB();

// Create a new client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_MEMBERS] });

client.once('ready', async() => {
   console.log('Ready!');
})

client.on('messageCreate', async msg => {
   if(msg.author.bot)return;
   let userStats = await MongoDB.getUserStats(msg.author.id);
   if(!userStats) {
      userStats = await MongoDB.addUserStats(msg.author.id, msg.author.username)
   }
   let userStatsNew = await MongoDB.addExp(userStats.id, Math.round(Math.random*(7-4)+4))
   if(userStatsNew.level != userStats.level) {
      let channel = client.channels.resolve(config.roles.channel)
      if(!channel)return;
      let embed = new MessageEmbed();
      embed.setTitle("Subiste nivel!")
      embed.setThumbnail(msg.author.displayAvatarURL())
      embed.setColor(msg.member.displayHexColor)
      embed.setDescription(`
      ${msg.member.displayName}\n
      **${userStats.level}**`+' `>>>` '+`**${userStatsNew.level}**`)
      let roleMsg
      config.roles.list.forEach((role) => {
         if(role.nivel <= userStatsNew.level) {
            if(!msg.member.roles.cache.has(role.id)){
               msg.member.roles.add(role.id)
               roleMsg = role.mensaje.replace('{user}', `<@${msg.author.id}>`)
            }
         }
      })
      if(channel) {
         channel.send({
            embeds: [embed]
         })
         if(!roleMsg)return;
         channel.send(roleMsg)
      }
   }
});

// Login to api
client.login(process.env.DISCORD_TOKEN)