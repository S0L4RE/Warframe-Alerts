const ws = require("../../worldstate/Worldstate.js");

function getKeys(worldstate, spacing, string, char1, initchar) {
  let keys = Object.keys(worldstate);
  for (let j = 0; j < keys.length; j++) {
    if (j === keys.length - 1) char1 = "└";
    const key = keys[j];
    let temp = "", tchar = "─";
    if (typeof worldstate[key] === "object" && typeof worldstate[key].push !== "function") {
      tchar = "┬";
      temp = getKeys(worldstate[key], spacing + 1, "", "├", "│");
    }
    for (let i = 0; i < spacing; i++) {
      string += (initchar || " ") + " ".repeat(3);
    }
    string += `${char1}${"─".repeat(3)}${tchar}${key} [${worldstate[key] && typeof worldstate[key] === "object" ? Object.keys(worldstate[key]).length : "x"}]\n  ${temp}`;
  }
  return string;
}

module.exports = {
  name: "ws",
  desc: "worldstate query service",
  example: "ws pc, ws xb1",
  run: (bot, message, args) => {
    let platform = "pc";
    if (args[0]) {
      platform = args[0].toLowerCase();
    }
    let state;
    try {
      state = ws.getWs[platform]();
    } catch(e) {
      return message.reply("Sorry, that's not a valid platform. Try `pc` `xb1` or `ps4`.");
    }
    message.reply("```haskell\n" +
    "This will let you browse through the worldstate. Just say a key and number \
and it will be zoomed into if it can be displayed. You have 20 seconds to respond. \n\
Examples: \nDailyDeals 1 \nLibraryInfo LastCompletedTargetType \n\n" +
    "Worldstate\n" + getKeys(state, 0, "  ", "├") + "```").then((msg) => {
      message.channel.awaitMessages((m) => m.author.id === message.author.id, {
        max: 1,
        time: 20000,
        errors: ["time"]
      }).then((collected) => {
        const junk = collected.first().content.split(" ");
        let state2 = state;
        for (thing of junk) {
          if (parseInt(thing)) thing = parseInt(thing) - 1;
          state2 = state2[thing];
        }
        msg.edit("```json\n" + JSON.stringify(state2, null, 2) + "```").catch((err) => {
          msg.edit("Sorry that's a little too long");
        });
      }).catch((err) => {
        message.channel.send("Something went wrong! " + err);
      })
    })
  }
}
