/*
 ┌ top left corner one space
 ┬ top intersection one space
 ┐ top right corner one space
 ├ middle left one space
 ┼ middle intersectio none space
 ┤ middle right one space
 └ bottom left one space
 ┴ bottom intersection one space
 ┘ bottom right one space
 ─ horiontal line
 │ vertical line
*/
/*
const logo = "\
\n\
      ___     _              _\n\
     | _ \\_ _(_)_ __  ___ __| |\n\
     |  _/ '_| | '  \\/ -_) _` |\n\
     |_|_|_| |_|_|_|_\\___\\__,_|     _     _\n\
     |   \\(_)_____ _ _ __ _ __  ___(_)_ _| |_\n\
     | |) | (_-< _` | '_ \\ '_ \\/ _ \\ | ' \\  _|\n\
     |___/|_/__|__,_| .__/ .__/\___/_|_||_\\__|\n\
                    |_|  |_|                  \n\
";
*/
const logo = ""; // rip logo too big for small screen users
const stringThings = require("../../util/stringThings.js");
const arrayThings = require("../../util/arrayThings.js");
const ws = require("../../worldstate/Worldstate.js");

function removeSlashPrefixes(str) {
    return str.replace(/\/.*\//g, "");
}

module.exports = {
  name: "baro",
  desc: "baro's status",
  example: "baro",
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
    const currentTime = Date.now() / 1000;
    const baro = state.VoidTraders[0];
    const activation = baro.Activation["$date"]["$numberLong"];
    const expire = baro.Expiry["$date"]["$numberLong"];
    let timeLeftTotalSeconds, timeLeftHours, timeLeftMinutes, timeLeftSeconds;
    let comego = "leaving from";
    if (activation > currentTime * 1000) { // he hasn't arrived yet
      comego = "arriving to";
      timeLeftTotalSeconds = (activation - currentTime * 1000) / 1000;
    } else {
      timeLeftTotalSeconds = (expire - currentTime * 1000) / 1000;
    }
    timeLeftHours = Math.floor(timeLeftTotalSeconds / 3600);
    timeLeftMinutes = Math.floor((timeLeftTotalSeconds - (timeLeftHours * 3600)) / 60);
    timeLeftSeconds = timeLeftTotalSeconds % 60 << 0;

    const eachline = logo.split("\n"); //
    const name = baro.Character, location = baro.Node, items = baro.Manifest;
    let deets_beginning = `\`\`\`haskell\n${name} ${comego} ${location} in ${timeLeftHours}h ${timeLeftMinutes}m ${timeLeftSeconds}s\n`; // nice spacing!!
    let item_price_array = [];
    if (items && items.length > 0) {
      for (let idx = 0; idx < items.length; idx++) {
        item_price_array.push([removeSlashPrefixes(items[idx].ItemType), stringThings.padRight(items[idx].PrimePrice + "", 4) + " Ducats", stringThings.padRight(items[idx].RegularPrice + "", 7) + " Credits"]);
      }
      deets_beginning += arrayThings.array2dtable(item_price_array);
    }
    deets_beginning += "```";
    message.reply(deets_beginning);
  }
}
