const RSSFeed = require("./feed/RSSFeed.js");
const MessageBroadcaster = require("./MessageBroadcaster.js");

class EventManager {
  constructor(client, type) {
    if (!EventManager.broadcaster)
      EventManager.broadcaster = new MessageBroadcaster(client); // shoud be static
    this.feed = new RSSFeed(type, EventManager.broadcaster);
    this.feed.updateFeed();
  }

  watch() {
    const em = this;
    this.timeout = setTimeout(() => {em.feed.updateFeed()}, 5 * 60e3);
  }
}

module.exports = EventManager;
