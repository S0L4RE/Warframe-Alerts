const fs = require("fs");
const main = require("./search.js");

module.exports = {
  name: "update",
  desc: "update datamine",
  example: "update",
  run: (bot, message, args) => {
    const dir = "./datamine";
    fs.readdir(dir, (err, files) => {
      if (err) console.error(err);
      files.forEach((file) => {
        if (file.substr(-2) === "js") {
          delete require.cache[require.resolve("../../datamine/" + file)];
          require("../../datamine/" + file);
        }
      })
    })
    setTimeout(main.update, 5000); // yeah...
    message.reply("Updating files...").then(msg => {
      setTimeout(() => {msg.edit("Files updated (hopefully).")}, 5000);
    });
  }
}
