const stringThings = require("../../util/stringThings");
const ws = require("../../worldstate/Worldstate.js");

function removeUnderscorePrefixes(str) {
  if (str.includes("SORTIE"))
    return str.replace(/SORTIE_.*?_/g, "");
  else if (str.includes("MT"))
    return str.replace("MT_", "");
  return str;
}

module.exports = {
  name: "sorties",
  desc: "get current sorties",
  example: "sorties",
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
    const sorties = state.Sorties[0];
    const expire = sorties.Expiry["$date"]["$numberLong"];
    const timeLeftTotalSeconds = (expire - currentTime * 1000) / 1000;
    const timeLeftHours = Math.floor(timeLeftTotalSeconds / 3600);
    const timeLeftMinutes = Math.floor((timeLeftTotalSeconds - (timeLeftHours * 3600)) / 60);
    const timeLeftSeconds = timeLeftTotalSeconds % 60 << 0;
    // let timeLeftSeconds = timeLeftTotalSeconds - (timeLeftHours * 3600) - (timeLeftMinutes * 60);
    const sortieBoss = removeUnderscorePrefixes(sorties.Boss);
    const missions = sorties.Variants;
    let deets = `\`\`\`haskell\n${platform} = boss: ${sortieBoss}, ${timeLeftHours}h ${timeLeftMinutes}m remaining\n`; // nice spacing!!
    // 50-60, 65-80, 80-100 what kind of shitty pattern is this?
    const levels = ["50-60", "65-80", "80-100"];
    for (let idx = 0; idx < missions.length; idx++) {
      deets += `levels: ${stringThings.padRight(levels[idx], 10)}`;
      deets += `modifier: ${stringThings.padRight(removeUnderscorePrefixes(missions[idx].modifierType), 20)}`;
      deets += `mission type: ${stringThings.padRight(removeUnderscorePrefixes(missions[idx].missionType), 20)} \n`;
      // deets += `${removeUnderscorePrefixes(missions[idx].node)} \n`
    }
    deets += `\`\`\``;
    message.reply(deets);
  }
}
