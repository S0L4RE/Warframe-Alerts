module.exports = {
  name: "about",
  desc: "setup and other info",
  example: "about",
  run: (bot, message, args, commands) => {
    message.channel.sendEmbed(new (require("discord.js")).RichEmbed()
      .setColor(Math.random() * 0xffffff)
      .setURL("https://bots.discord.pw/bots/267451911840595980")
      .setTitle("Setup instructions and more")
      .setDescription("```prolog\n1. Add the channels to your server: \n" +
      "\tpc_wf_alerts, xb1_wf_alerts, ps4_wf_alerts \n" +
      "depending on what platforms you want. This can be done with " +
      "the command ,channelsetup. This command will also deny everyone Send Message " +
      "permissions for that channel``````prolog\n" +
      "2. If you want notifications, use the ,rolesetup [platform] command " +
      "to add roles for the platform you want. If nothing is specified, then " +
      "roles for all platforms will be created. It will take 5 seconds * number " +
      "of roles being created to create all roles. A list of created roles can " +
      "be accessed by using the ,notify command without any arguments.```"
      )
      .addField("Other comments", "The bot should delete alerts/update invasions when they expire" +
      "However, sometimes the server goes down and the messages wont be deleted. Try using a purge command " +
      "from another bot if they get too annoying.")
      .addField("Necessary Permissions", "Manage Roles\nManage Channels", true)
      .addField("Questions?", "Contact reimu#3856")
      .setFooter("This is still a work in progress, expect some changes!")
    )
  }
}
