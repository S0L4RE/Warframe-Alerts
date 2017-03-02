const stringThings = require("../../util/stringThings");

module.exports = {
  name: "help",
  desc: "help command",
  example: "help",
  run: (bot, message, args, commands) => {
    // commands is a map
    let help_message = "Add the prefix yourself \n";
    commands.forEach((cmd) => {
      if (!cmd.name) return;
      help_message += (`  ${stringThings.padRight(cmd.name, 10)}${stringThings.padRight(cmd.desc, 35)}${cmd.example}\n`);
    })
    // help_message += "Put the prefix in yourself\n" + help_message;
    message.reply(`\`\`\`\n${help_message}\`\`\``);
  }
}
