const RSSEvent = require("./RSSEvent");
// const ws = require("../ws/ws");

class InvasionEvent extends RSSEvent{
  constructor(guid, author, title, pubDate, type) {
    super(guid, author, title.replace("PHORID SPAWN ", ""), pubDate);
    this.platform_type = type; // type will be PS4, XB1, or PC
  }

  broadcast(bot, data = {interval: 11, event: this, func: this.update}) {
    let bm = new BroadcastMessage(bot, data);
    // TODO update broadcast message
    let content = `\`\`\`diff\n- [${this.platform_type} = ${this.type}] -\n+ [${this.platform_type}_Title]: ${this.title}\n+ [Date]: ${this.date}\n\`\`\``;
    // timestamp broadcast
    bm.broadcast(new Date(Date.now()).toUTCString() + content);
  }

  /**
   * update the BroadcastMessage
   * @param {BroadcastMessage} bm the BroadcastMessage that will be updated
   * @param {InvasionEvent} obj the InvasionEvent that holds the data
   */
  update(bm) {
    // console.log("this" + JSON.stringify(this, null, 2));
    // console.log(`updating ${event.guid}`);
    // example titles:
    // Grineer (3x Detonite Injector) VS. Corpus (3x Fieldron) - Palus (Pluto)
    // 4700cr - Unda (Venus) - 41m
    // looks like location is always after -
    // rewards are always before -
    // this is an invasions so always vs
    //
    // so the non pc worldstates store the guid in
    // $_id.$id instead of $_id.$oid wow nice
    let invasions = ws.getWs().Invasions;
    let nested_id = "$oid";
    if (bm.event.platform_type === "PS4") {
      invasions = ws.getPS4Ws().Invasions;
      nested_id = "$id";
    }
    else if (bm.event.platform_type === "XB1") {
      invasions = ws.getXB1Ws().Invasions;
      nested_id = "$id";
    }
    let obj = bm.event;
    let width = 80;
    let content = "```diff\n";
    let location = obj.title.split(" - ");
    let factions = location[0].split(" VS. ");
    location = location[1];
    content += `+ [${obj.platform_type} = ${obj.type}]`
    content += "\n";
    content += `+ [Location]: ${location}`;
    content += "\n";
    // at least 1 faction but can't guarantee 2
    let second_length = factions[1] ? factions[1].length : 0;
    // math abs to avoid negative numbers that are off by like 1 xd
    content += `--- ${factions[0]}${" ".repeat(Math.abs(width - factions[0].length - second_length - 8))}${factions[1] ? factions[1]:""} ---`
    content += "\n";
    for (let idx = 0; idx < invasions.length; idx++) {
      if (invasions[idx]["_id"][nested_id] === obj.guid) {
        let info = invasions[idx];
        if (info.Completed) break; // if its completed, delete message and stop interval
        let pct = (info.Goal - info.Count) / (info.Goal * 2);
        let somenum = width * pct;
        content += `+${"#".repeat(Math.abs(width - somenum - 1))}`;
        content += "\n";
        content += `-${" ".repeat(Math.abs(width-somenum - 1)) + "#".repeat(somenum)}`;
        content += "```";
        // timestamp message
        return bm.message.forEach((msg) => {msg.edit(new Date(Date.now()).toUTCString() + content)
          .then((msg) => {
            console.log("Edited an invasion message.");
          }).catch((e) => {
            console.error(e);
          });
        });
      }
    }
    // if we couldnt match the guid then delete the message
    // and stop the interval
    bm.message.forEach((msg) => {msg.delete()
      .then((msg) => {
        console.log("Deleted an invasion message.");
      }).catch((e) => {
        console.error(e);
      })
    });
    bm.stopInterval();
  }
}

module.exports = InvasionEvent;
