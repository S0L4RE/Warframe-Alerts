const fs = require("fs");
const token = require("./token").token;
const tasks = require("./autotasks/Auto");
const Discord = require("discord.js");
const config = require("./config");

const recent_commanders = new Set();
const bot = new Discord.Client(); // :eyes:

/**
 * load commands
 */
const commands = new Map();
function walk(dir) {
	dir += "/";
	// console.log("dir " + dir);
	fs.readdir(dir, (err, files) => {
	  if(err) console.err(err);
	  files.forEach(file => {
			fs.stat(dir + file, (err, stats) => {
				if (stats && stats.isDirectory()) {
					walk(dir + file)
				} else {
					let cmd = require(dir + file);
			    commands.set(cmd.name, cmd);
				}
			})
	  });
	});
}
walk("./commands");

function command_cooldown(user_id) {
	recent_commanders.add(user_id);
	setTimeout(() => {recent_commanders.delete(user_id)}, config.cooldown)
}

bot.once("ready", () => {
	bot.user.setGame(config.game);
	tasks.rssFeed(bot);
	console.log("Loaded bot");
});

bot.on("message", message => {
	if (message.content.startsWith(config.prefix)) {
		if (recent_commanders.has(message.author.id))	return message.reply("Wait a bit for another command");

		let args = message.content.split(" ");
		let command = args[0].slice(config.prefix.length);
		args = args.slice(1);

		if(commands.has(command)) {
			command_cooldown(message.author.id);
    	commands.get(command).run(bot, message, args);
  	} else {
			message.reply("Can't find that command buddy.");
		}
	}
});

process.on("unhandledRejection", uR => {
	console.error(uR);
});

bot.login(token);
