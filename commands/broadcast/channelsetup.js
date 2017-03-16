module.exports = {
  name: "channelsetup",
  desc: "set up the alert channels",
  example: "channelsetup",
  run: (bot, message, args) => {
    let addedRoles = [];
    if (message.member.hasPermission("MANAGE_CHANNELS") && message.guild.member(bot.user).hasPermission("MANAGE_CHANNELS")) {
      let channelNames = ["pc_wf_alerts", "xb1_wf_alerts", "ps4_wf_alerts"];
      for (let i = 0; i < channelNames.length; i++) {
        if (message.guild.channels.find("name", channelNames[i])) {
          console.log(channelNames[i]);
          channelNames.splice(i, 1);
          i--;
        }
      }
      if (channelNames.length < 1) {
        return message.reply("You have all the channels!");
      }
      const overwrites = [{
        type: 'role',
        id: message.guild.id, // everyone role has same id as guild
        deny: 0x00000800 // deny send message
      }, {
        type: 'member',
        id: bot.user.id,
        allow: 0x00000800
      }];
      for (let i = 0; i < channelNames.length; i++) {
        message.guild.createChannel(channelNames[i], "text", overwrites);
      }
      message.reply("Creating channels `" + channelNames.join("`, `") + "`");
    } else {
      message.reply("Someone is missing manage channels permissions, either you or me.");
    }
  }
}
