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
const stringThings = require("../../util/stringThings");
const arrayThings = require("../../util/arrayThings");
const ws = require("../../ws/ws");

function removeSlashPrefixes(str) {
    return str.replace(/\/.*\//g, "");
}

module.exports = {
  name: "baro",
  desc: "baro's status",
  example: "baro",
  run: (bot, message, args, commands) => {
    let state = ws.getWs();
    let platform = "PC";
    if (args[0]) {
      args[0] = args[0].toUpperCase()
      if (args[0] === "PS4") {
        return message.reply("I'll update this when DE fixes their inconsistent world state formatting");
        platform = "PS4";
        state = ws.getPS4Ws();
      } else if (args[0] === "XB1") {
        platform = "XB1";
        return message.reply("I'll update this when DE fixes their inconsistent world state formatting");
        state = ws.getXB1Ws();
      }
    }
    let currentTime = state.Time;
    let baro = state.VoidTraders[0];
    let activation = baro.Activation["$date"]["$numberLong"];
    let expire = baro.Expiry["$date"]["$numberLong"];
    let timeLeftTotalSeconds, timeLeftHours, timeLeftMinutes;
    let comego = "leaving from";
    if (activation > currentTime * 1000) { // he hasn't arrived yet
      comego = "arriving to";
      timeLeftTotalSeconds = (activation - currentTime * 1000) / 1000;
      timeLeftHours = Math.floor(timeLeftTotalSeconds / 3600);
      timeLeftMinutes = Math.floor((timeLeftTotalSeconds - (timeLeftHours * 3600)) / 60);
    } else {
      timeLeftTotalSeconds = (expire - currentTime * 1000) / 1000;
      timeLeftHours = Math.floor(timeLeftTotalSeconds / 3600);
      timeLeftMinutes = Math.floor((timeLeftTotalSeconds - (timeLeftHours * 3600)) / 60);
    }
    let eachline = logo.split("\n"); //
    let name = baro.Character;
    let location = baro.Node;
    let items = baro.Manifest;
    let longestItemNameLength = 0;
    let deets_beginning = `\`\`\`haskell\n${platform} = ${name} ${comego} ${location} in ${timeLeftHours}h ${timeLeftMinutes}m\n`; // nice spacing!!
    let deets = "";
    let item_price_array = [];
    // trying to make a 2d array of the items without reference here
    // and then use array2dtable to convert it
    // item name, ducat price, credit price
    if (items && items.length > 0) {
      for (let idx = 0; idx < items.length; idx++) {
        item_price_array.push([removeSlashPrefixes(items[idx].ItemType), stringThings.padRight(items[idx].PrimePrice + "", 4) + " Ducats", stringThings.padRight(items[idx].RegularPrice + "", 7) + " Credits"]);
      }
      deets_beginning += arrayThings.array2dtable(item_price_array);
    }
    deets_beginning += "```";
    message.reply(deets_beginning);
    // hypothetically this should be the table of items
    // all it needs is the codeblocks and some extra text so
    // end attempt
    /*
    if (items && items.length > 0) { // just double checkin
      for (let idx = 0; idx < items.length; idx++) {
        let itemname = removeSlashPrefixes(items[idx].ItemType);
        longestItemNameLength = Math.max(longestItemNameLength, itemname.length);
      }
      for (let idx = 0; idx < items.length; idx++) {
        deets += `│${stringThings.padRight(removeSlashPrefixes(items[idx].ItemType), longestItemNameLength)}`;
        deets += `│${stringThings.padRight(stringThings.padRight(items[idx].PrimePrice + "", 3) + " Ducats", 10)}│`;
        deets += `${stringThings.padRight(stringThings.padRight(items[idx].RegularPrice + "", 6) + " Credits", 14)}│`;
        deets += (eachline[idx] || "") + "\n";
      }
      deets = `${deets_beginning}┌${"─".repeat(longestItemNameLength)}┬──────────┬──────────────┐\n${deets}`;
      deets += `└${"─".repeat(longestItemNameLength)}┴──────────┴──────────────┘\`\`\``;
    } else {
      deets = deets_beginning;
      deets += `\`\`\``;
    }
    message.reply(deets);
    */
  }
}
