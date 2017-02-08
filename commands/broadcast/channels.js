module.exports = {
  name: "channel",
  desc: "does nothing",
  example: "channel",
  run: (bot, message, args) => {
    let channels = require("../../broadcast/channels.json");
    let id = message.guild.id;
    channels[id].Channel = message.channel.id;
    // fs.writeFile("../../broadcast/channels.json")
    message.reply("This was going to let you add a specific channel but I can't write to files in Heroku and I'm too poor for a db.");
  }
}
