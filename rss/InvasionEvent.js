const RSSEvent = require("./RSSEvent");
const request = require("request");
// is required in event so i dont know why its needed here
// probably no super or something??
const BroadcastMessage = require("../broadcast/BroadcastMessage");

let invasions = {};

/**
 * update the invasions information from the WorldState
 */
function updateInvasions() {
  request({uri: "http://content.warframe.com/dynamic/worldState.php"}, (err, response, body) => {
    if (err) return console.error(err);
    if (response.statusCode != 200) return console.error(response);
    invasions = JSON.parse(body).Invasions;
  });
}
updateInvasions();
setInterval(updateInvasions, 9 * 1000 * 60);

class InvasionEvent extends RSSEvent{
  constructor(guid, author, title, pubDate) {
    super(guid, author, title.replace("PHORID SPAWN ", ""), pubDate);
  }

  /**
   * broadcast the message
   * @param {Object} data default arguments that will be passed to the BroadcastMessage constructor
   */
  broadcast(data = {interval: 0.1, event: this, func: this.update}) {
    let bm = new BroadcastMessage(data);
    // TODO update broadcast message
    let content = `\`\`\`diff\n+ [GUID]: ${this.guid}\n- [${this.type}] -\n+ [Title]: ${this.title}\n+ [Date]: ${this.date}\n\`\`\``;
    // timestamp broadcast
    bm.broadcast(new Date(Date.now()).toUTCString() + content);
  }

  /**
   * update the BroadcastMessage
   * @param {BroadcastMessage} bm the BroadcastMessage that will be updated
   * @param {InvasionEvent} obj the InvasionEvent that holds the data
   */
  update(bm, obj) {
    console.log(`updating ${obj.guid}`);
    // console.log("this" + JSON.stringify(this, null, 2));
    // console.log(`updating ${event.guid}`);
    // example titles:
    // Grineer (3x Detonite Injector) VS. Corpus (3x Fieldron) - Palus (Pluto)
    // 4700cr - Unda (Venus) - 41m
    // looks like location is always after -
    // rewards are always before -
    // this is an invasions so always vs
    let width = 80;
    let content = "```diff\n";
    let location = obj.title.split(" - ");
    let factions = location[0].split(" VS. ");
    location = location[1];
    content += `+ [Location]: ${location}`;
    content += "\n";
    // at least 1 faction but can't guarantee 2
    let second_length = factions[1] ? factions[1].length : 0;
    content += `--- ${factions[0]}${" ".repeat(width - factions[0].length - second_length - 9)}${factions[1] ? factions[1]:""} ---`
    content += "\n";
    for (let idx = 0; idx < invasions.length; idx++) {
      if (invasions[idx]["_id"]["$id"] === obj.guid) {
        let info = invasions[idx];
        if (info.Completed) break; // if its completed, delete message and stop interval
        let pct = (info.Goal - info.Count) / (info.Goal * 2);
        let somenum = width * pct;
        content += `+${"#".repeat(width - somenum - 1)}`;
        content += "\n";
        content += `-${" ".repeat(width-somenum - 1) + "#".repeat(somenum)}`;
        content += "```";
        // timestamp message
        return bm.message.edit(new Date(Date.now()).toUTCString() + content);
      }
    }
    // if we couldnt match the guid then delete the message
    // and stop the interval
    bm.message.delete();
    bm.stopInterval();
  }
}

module.exports = InvasionEvent;
