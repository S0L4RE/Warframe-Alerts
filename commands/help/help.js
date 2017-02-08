function padRight(string, length) {
  // assume string length is less than length
  return string + " ".repeat(length - string.length);
}

module.exports = {
  name: "help",
  desc: "help command",
  example: "help",
  run: (bot, message, args, commands) => {
    // commands is a map
    let help_message = "Add the prefix yourself \n";
    commands.forEach((cmd) => {
      if (!cmd.name) return;
      help_message += (`${padRight(cmd.name, 10)}${padRight(cmd.desc, 35)}${cmd.example}\n`);
    })
    // help_message += "Put the prefix in yourself\n" + help_message;
    message.reply(`\`\`\`\n${help_message}\`\`\``);
  }
}
