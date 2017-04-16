module.exports = {
  name: "about",
  desc: "bot info and changelog",
  example: "about",
  run: (bot, message, args, commands) => {
    message.channel.sendEmbed(new (require("discord.js")).RichEmbed()
      .setColor(Math.random() * 0xffffff)
      .setURL("https://bots.discord.pw/bots/267451911840595980")
      .setTitle("Homepage")
      .addField("About", "```A bot that will provide realtime* alert/invasion\n" +
      "information to your Discord Server!```")
      .addField("Changelog", `\`\`\`Re-add search commands
Increase update timer to 5 minutes.\`\`\``)
      .addField("Questions?", "Contact reimu#3856\nDirect Messages > Friends > Add Friend")
      .setFooter("* - give or take 5-10 minutes. This is still a work in progress, expect some changes!")
    )
  }
}
