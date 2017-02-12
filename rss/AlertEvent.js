const RSSEvent = require("./RSSEvent");
const BroadcastMessage = require("../broadcast/BroadcastMessage");

class AlertEvent extends RSSEvent{
  constructor(guid, author, title, pubDate, description, wffaction, wfexpiry, type) {
    super(guid, author, title, pubDate);
    this.description = description;
    this.faction = wffaction;
    this.expiry = wfexpiry;
    this.platform_type = type; // type will be PS4, XB1, or PC
  }

  /**
   * create a new BroadcastMessage for this event
   * @param {Object} data the params to set up the BroadcastMessage with
   */
  broadcast(bot, data = {timeout: 10, func: "delete", event: this}) {
    let title = this.title.split(" - ");
    // second to last in title is the location
    // last is the duration
    // everything else is rewards
    // add the type (alert), description, and location
    let content = `\`\`\`diff\n- [${this.platform_type} = ${this.type}] -\n+ [Desc]: ${this.description}\n+ [Location]: ${title[title.length - 2]}\n`;
    // add the rewards
    for (let idx = 0; idx < title.length - 2; idx++) {
      content += `+ [${this.platform_type}_Reward]: ${title[idx]}\n`;
    }
    // add the time left
    content += `+ [Duration]: ${title[title.length - 1]}\`\`\``;
    data.timeout = title[title.length - 1].replace("m", "");
    let bm = new BroadcastMessage(bot, data);
    // timestamp broadcast
    bm.broadcast(new Date(Date.now()).toUTCString() + content);
  }
}

module.exports = AlertEvent;
