const request = require("request");
const arrayThings = require("../../util/arrayThings");

const op_url = "http://content.warframe.com/dynamic/pacifismDefect.php";

module.exports = {
  name: "oper",
  desc: "get info for current operation",
  example: "oper",
  run: (bot, message, args) => {
    if (!op_url) return message.reply("No operations right now!");
    request({uri: op_url}, (err, response, body) => {
      if (err) return console.error(err);
      if (response.statusCode != 200) return console.error(response);
      let top10 = body.match(/Top 10% Score[^]*?<tr class="last">/g);
      top10[0] = top10[0].replace(/<.*?>/g, " "); // remove html elements
      let table = top10[0].split("\n").map(r => r.split("  "));
      table.splice(1, 1); // these are empty entries
      table.splice(6, 1);
      table = arrayThings.array2dtable(table);
      message.channel.sendMessage("```haskell\nHere are the scores needed to be in the top 10%.\n" + table + "```");
    })
  }
}
