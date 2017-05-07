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
      message.channel.send(["```fix",
        "Looks like I can't dm you so I'll send this here instead.",
        arrayThings.array2dtable(help_message),
        "Deletes in 20 seconds.```"
      ]).then((msg) => {msg.delete(20000)});
    })
  }
}
