const stringThings = require("../../util/stringThings");
const ws = require("../../worldstate/Worldstate.js");

module.exports = {
  name: "darvo",
  desc: "get todays discount",
  example: "darvo, darvo xb1",
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
    const deal = state.DailyDeals[0];
    const currentTime = Date.now() / 1000;
    const expire = deal.Expiry["$date"]["$numberLong"];
    const timeLeftTotalSeconds = (expire - currentTime * 1000) / 1000;
    const timeLeftHours = Math.floor(timeLeftTotalSeconds / 3600);
    const timeLeftMinutes = Math.floor((timeLeftTotalSeconds - (timeLeftHours * 3600)) / 60);
    const timeLeftSeconds = timeLeftTotalSeconds % 60 << 0;
    // let timeLeftSeconds = timeLeftTotalSeconds - (timeLeftHours * 3600) - (timeLeftMinutes * 60);
    let deets = `\`\`\`haskell\n${platform} | Darvo's Daily Deal ${timeLeftHours}h ${timeLeftMinutes}m ${timeLeftSeconds}s remaining\n`; // nice spacing!!
    // 50-60, 65-80, 80-100 what kind of shitty pattern is this?
    deets += `storeitem:  ${stringThings.padRight(deal.StoreItem, 20)} \n`;
    deets += `original:   ${stringThings.padRight(deal.OriginalPrice, 20)} Plat\n`;
    deets += `discounted: ${stringThings.padRight(deal.SalePrice, 20)} Plat ()${deal.Discount}% off)\n`;
    deets += `stock:      ${deal.AmountTotal - deal.AmountSold}/${deal.AmountTotal}`;
    // deets += `${removeUnderscorePrefixes(missions[idx].node)} \n`
    deets += `\`\`\``;
    message.reply(deets);
  }
}
