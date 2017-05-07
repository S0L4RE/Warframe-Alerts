const arrayThings = require("../../util/arrayThings");

module.exports = {
  name: "help",
  desc: "help command",
  example: "help",
  run: (bot, message, args, commands) => {
    // commands is a map
    let help_message = [["Command", "Description", "Example"],[]];
    commands.forEach((cmd) => {
      if (!cmd.name || cmd.ignore) return;
      help_message.push([cmd.name, cmd.desc, cmd.example]);
    })
    message.author.send("```fix\n" + arrayThings.array2dtable(help_message) + "```").then((msg) => {
    }).catch(e => {
      message.reply("```fix\nLooks like I can't dm you so I'll send this here instead.\n" +
      arrayThings.array2dtable(help_message) + "\nDeletes in 20 seconds.```").then((msg) => {msg.delete(20000)});
    })
  }
}
