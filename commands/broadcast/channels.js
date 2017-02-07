module.exports = {
  name: "broadcast",
  run: (bot, message, args) => {
    let channels = require("../../broadcast/channels.json");
    let id = message.guild.id;
    channels[id].Channel = message.channel.id;
    // fs.writeFile("../../broadcast/channels.json")
    message.reply("This does nothing.");
  }
}
