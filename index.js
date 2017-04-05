const fs = require("fs");
const { token } = require("./token")
const { dbottoken } = require("./token")
const tasks = require("./autotasks/Auto");
const Discord = require("discord.js");
const config = require("./config");

const bot = new Discord.Client();

let ready = false;
const recent_commanders = new Set();
const commands = new Map();

function walk(dir) {
  dir += "/";
  fs.readdir(dir, (err, files) => {
    if (err) console.error(err);
    files.forEach(file => {
      fs.stat(dir + file, (err, stats) => {
        if (stats && stats.isDirectory()) {
          walk(dir + file)
        } else if (file.substr(-2) === "js") {
          let cmd = require(dir + file);
          commands.set(cmd.name, cmd);
          console.log(`Loaded ${cmd.name} command`);
        }
      })
    })
  })
}
walk("./commands");

function command_cooldown(user_id) {
  recent_commanders.add(user_id);
  setTimeout(() => {
    recent_commanders.delete(user_id)
  }, config.cooldown)
}

bot.on("guildCreate", (guild) => {
  bot.channels.get("295908551535099905").send(`Just joined ${guild.name}! Now in ${bot.guilds.size} guilds!`);
  let server_count = bot.guilds.size;
  superagent.post(`https://bots.discord.pw/api/bots/${bot.user.id}/stats`)
    .set('Authorization', dbottoken)
    .type('application/json')
    .send({
      server_count
    })
    .end(error => {
      console.log(`Updated bot server count to ${bot.guilds.size}`);
      if (error) console.error(error.status || error.response);
    });
})

bot.on("guildDelete", (guild) => {
  bot.channels.get("295908551535099905").send(`Just got the boot from ${guild.name}! Now in ${bot.guilds.size} guilds!`);
})

bot.on("disconnect", (event) => {
  console.log(event);
  if (event.code === 1000) {
    console.log("Disconnected: code 1000");
    process.exit();
  }
})

bot.once("ready", () => {
  bot.user.setGame(config.game);
  tasks.rssFeed(bot);
  tasks.worldState();
  console.log("Loaded bot");
  setTimeout(function() {
    ready = true;
  }, 2000); // give me 2 sec to start up :)
});

bot.on("message", message => {
  if (message.author.bot || !message.guild || !ready) return;
  if (message.content.startsWith(config.prefix)) {
    if (recent_commanders.has(message.author.id)) return message.reply("Wait a bit for another command");

    const [command, ...args] = message.content.slice(config.prefix.length).split(" ");
    if (commands.has(command)) {
      console.log(new Date(), message.guild.id, message.author.id, message.author.username, command, args);
      command_cooldown(message.author.id);
      try {
        commands.get(command).run(bot, message, args, commands);
      } catch (e) {
        message.reply("Something really bad happened, please notify `reimu#3856`: " + e);
      }
    } else if (command === "eval" && message.author.id === "84678516477534208") {
      try {
        let code = args.join(" ");
        let ev = eval(code);
        if (typeof ev !== "string") ev = require("util").inspect(ev);
        message.reply(ev).catch((e) => {
          message.reply("probably too long");
        });
      } catch (e) {
        message.reply(e);
      }
    }
  }
});

process.on("unhandledRejection", uR => {
  console.error(uR);
});

bot.login(token);
