// load libs and classes
const Discord = require("discord.js");
const fs = require("fs");
const { token } = require("./token.js");
const { dbottoken } = require("./token.js");
const tasks = require("./autotasks/Auto.js");
const config = require("./config.json");

// actual client
const bot = new Discord.Client();

// some random vars
let ready = false;
const recent_commanders = new Set();
const commands = new Map();
const ignore = ["broadcast", "worldstate"]; // command subfolders to ignore
let logChannel, errorCode = 0;

// load commands
function walk(dir) {
  dir += "/";
  fs.readdir(dir, (err, files) => {
    if (err) console.error(err);
    files.forEach(file => {
      fs.stat(dir + file, (err, stats) => {
        if (stats && stats.isDirectory()) {
          if (ignore.includes(file)) return;
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
console.log("=== Loading commands ===");
walk("./commands");

function command_cooldown(user_id) {
  recent_commanders.add(user_id);
  setTimeout(() => {
    recent_commanders.delete(user_id)
  }, config.cooldown)
}

bot.on("guildCreate", (guild) => {
  logChannel.send(`Just joined ${guild.name}! Now in ${bot.guilds.size} guilds!`);
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
  logChannel.send(`Just got the boot from ${guild.name}! Now in ${bot.guilds.size} guilds!`);
})

bot.on("disconnect", (event) => {
  console.log(`[${event.code}] ${event}`);
  errorCode = event.code;
})

bot.once("ready", () => {
  logChannel = bot.channels.get("295908551535099905");
  logChannel.send(`Just connected! Disconnected earlier with code ${errorCode}`)
  bot.user.setGame(config.game);
  tasks.eventFeed(bot);
  setTimeout(() => {
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
