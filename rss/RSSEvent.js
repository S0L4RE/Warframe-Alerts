const BroadcastMessage = require("../broadcast/BroadcastMessage");

class RSSEvent {
  constructor(guid, author, title, pubDate) {
    this.guid = guid;
    this.type = author;
    this.title = title;
    this.date = pubDate;
  }

  /**
   * generic broadcast method overriden in both types of events
   * @param {Object} data the data to setup the BroadcastMessage with
   */
  broadcast(data = {}) {
    let bm = new BroadcastMessage(data);
    let content = `\`\`\`diff\n${this.guid}\n${this.type}\n${this.title}\n${this.date}\n\`\`\``
    bm.broadcast(content);
  }
}

module.exports = RSSEvent;
