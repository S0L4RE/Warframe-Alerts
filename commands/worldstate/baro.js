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
    let deets_beginning = `\`\`\`haskell\n${name} ${comego} ${location} in ${timeLeftHours}h ${timeLeftMinutes}m\n`; // nice spacing!!
    let deets = "";
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
      deets += `\`\`\``;
    }
    message.reply(deets);
  }
}
