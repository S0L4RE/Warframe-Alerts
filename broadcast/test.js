const bot = new (require("discord.js")).Client();
bot.login("Mjc3ODE4Mzg5NzU2NjQxMjgw.C8b0WQ.46KK9MZMbVbBhuuvXiE7bwP2CqQ");

const em = require("./EventManager.js");

bot.on("ready", () => {
	let m1 = new em(bot, "pc");
	let m2 = new em(bot, "ps4");
	let m3 = new em(bot, "xb1");
	m1.watch();
	m2.watch();
	m3.watch();
});
