const token = require("./token.js").token;
const fs = require("fs");
const Discord = require("discord.js");
const recent_commanders = [];
const prefix = "?";

bot = new Discord.Client(); // :eyes:

/**
 * load commands
 */
const commands = new Map();
function walk(dir) {
	dir += "/";
	// console.log("dir " + dir);
	fs.readdir(dir, (err, files) => {
	  if(err) console.log(err);
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
	recent_commanders.push(user_id);
	setTimeout(function(){recent_commanders.splice(recent_commanders.indexOf(user_id), 1)},config.bot_command_cooldown)
}

bot.on("ready", () => {
	console.log("Loaded bot");
});

bot.on("message", message => {
	if (message.content.startsWith(prefix)) {

		if (recent_commanders.includes(message.author.id)) {
			return message.reply("Wait a bit for another command");
		}

		let args = message.content.split(" ");
		let command = args[0].slice(prefix.length);
		args = args.slice(1);

		if (command === "test") {
			require("./rss/GetFeed");
			delete require.cache[require.resolve("./rss/GetFeed")];
		}
		if(commands.has(command)) {
			command_cooldown(message.author.id);
    	commands.get(command).run(bot, message, args);
  	} else {
			message.reply("nonexistant");
		}
	}
});

process.on("unhandledRejection", uR => {
	console.log(uR);
});

bot.login(token);
