const fs = require("fs");
const main = require("./search.js");

module.exports = {
  name: "update",
  ignore: true,
  desc: "update datamine",
  example: "update",
  run: (bot, message, args) => {
    if (message.author.id !== "84678516477534208") return message.reply("Sorry only reimu can use this command.");
    message.reply("Updating files").then((msg) => {
      require("../../datamine/updateAll.js").masterUpdate().then((results) => {
        if (!results.some(r => !r[1])) { // no falses
          msg.edit("Everything updated a-ok");
        } else {
          msg.edit(["```", ...results, "```"]);
        }
        main.update();
      })
    })
  }
}
