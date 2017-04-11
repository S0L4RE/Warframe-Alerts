module.exports = {
  name: "cleanchannel",
  desc: "remove msgs before a msg",
  example: "cleanchannel 301156134457180160",
  run: (bot, message, args) => {
    if (message.member.hasPermission("ADMINISTRATOR") && ["pc_wf_alerts", "xb1_wf_alerts", "ps4_xb1_alerts"].includes(message.channel.names)) {
      if (args.length < 1) {
        return message.reply("Provide the id of the message you want to delete stuff before.");
      }
      message.channel.fetchMessages({before: args[0], limit: 100}).then((msgs) => {
        message.channel.bulkDelete(msgs).catch((error) => {
          message.reply("Some error: " + error);
        });
      }).catch((error) => {
        message.reply("Some error: " + error);
      })
    } else {
      return message.reply("Sorry, you need administrator permissions for this command and can only use this in the alert channels.");
    }
  }
}
