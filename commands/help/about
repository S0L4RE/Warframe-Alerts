module.exports = {
  name: "about",
  desc: "about the bot",
  example: "about",
  run: (bot, message, args, commands) => {
    let author = message.channel.members.get("84678516477534208").user;
    message.channel.sendMessage("", {embed:{
      color: Math.random() * 0xffffff,
      author: {
        name: author.username,
        icon_url: author.avatarURL
      },
      title: "Source",
      url: "https://github.com/rei2hu/wf-bot-2.0",
      description: "A warframe bot by reimu.",
      timestamp: new Date()
    }})
  }
}
