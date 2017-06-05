module.exports = (bot, config, tasks) => {
  const log = bot.channels.get(config.logs);
  try {
    log.send(`${(new Date()).toUTCString()} Looks like I just restarted.`);
  } catch(e) {
    console.log("really bad junk happened");
  }
  bot.user.setGame(config.game);
  tasks.eventFeed(bot);
  bot.on("ready", () => {
    log.send(`Just reconnected!`);
  });
}
