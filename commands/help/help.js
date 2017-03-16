const arrayThings = require("../../util/arrayThings");

module.exports = {
  name: "help",
  desc: "help command",
  example: "help",
  run: (bot, message, args, commands) => {
    // commands is a map
    let help_message = [["Command", "Description", "Example"],[]];
    commands.forEach((cmd) => {
      if (!cmd.name) return;
      help_message.push([cmd.name, cmd.desc, cmd.example]);
    })
    message.reply("```fix\n" + arrayThings.array2dtable(help_message) + "\n For any other questions, please contact reimu#3856.```").then((msg) => {
    });
  }
}
