const stringThings = require("../../util/stringThings");
const ws = require("../../worldstate/Worldstate.js");
const stars = require("../../datamine/star_chart.json");

function tierToRelic(tier) {
  // cheap padding lul
  return ["Lith", "Meso", "Neo", "Axi"][parseInt(tier.slice(-1)) - 1];
}

function removeUnderscorePrefixes(str) {
  if (str.includes("SORTIE"))
    return str.replace(/SORTIE_.*?_/g, "");
  else if (str.includes("MT"))
    return str.replace("MT_", "");
  return str;
}

module.exports = {
  name: "fissures",
  desc: "get the current fissures",
  example: "fissures, fissures ps4",
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
    const fissures = state.ActiveMissions;
    const currentTime = Date.now() / 1000;
    let deets = `\`\`\`haskell\n${platform} | Fissures\n`;
    deets += `Location           Type            Tier    Time Remaining\n`
    for (let i = 0; i < fissures.length; i++) {
      const expire = fissures[i].Expiry["$date"]["$numberLong"];
      const timeLeftTotalSeconds = (expire - currentTime * 1000) / 1000;
      if (timeLeftTotalSeconds < 0) continue;
      const timeLeftHours = Math.floor(timeLeftTotalSeconds / 3600);
      const timeLeftMinutes = Math.floor((timeLeftTotalSeconds - (timeLeftHours * 3600)) / 60);
      const timeLeftSeconds = timeLeftTotalSeconds % 60 << 0;
      const star = stars[fissures[i].Node];
      deets += `${stringThings.padRight(star.name, 18)} ${stringThings.padRight(removeUnderscorePrefixes(star.mission_type), 15)} ${stringThings.padRight(tierToRelic(fissures[i].Modifier), 7)} `;
      deets += `${stringThings.padLeft(timeLeftHours, 4)}h ${stringThings.padLeft(timeLeftMinutes + "m", 3)} ${stringThings.padLeft(timeLeftSeconds + "s", 3)}\n`; // nice spacing!!
    }
    // 50-60, 65-80, 80-100 what kind of shitty pattern is this?
    // deets += `storeitem:  ${stringThings.padRight(deal.StoreItem, 20)} \n`;
    // deets += `${removeUnderscorePrefixes(missions[idx].node)} \n`
    deets += `\`\`\``;
    message.reply(deets);
  }
}
