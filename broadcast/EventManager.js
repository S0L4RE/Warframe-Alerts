const RSSFeed = require("./feed/RSSFeed.js");
const MessageBroadcaster = require("./MessageBroadcaster.js");
const InvasionBroadcaster = require("./InvasionBroadcaster.js");

class EventManager {
  constructor(client, type) {
    if (!EventManager.broadcaster)
      EventManager.broadcaster = new MessageBroadcaster(client); // shoud be static
    if (!EventManager.iBroadcaster)
      EventManager.iBroadcaster = new InvasionBroadcaster(client);
    this.feed = new RSSFeed(type, EventManager.broadcaster, EventManager.iBroadcaster);
    this.feed.updateFeed(true); // change to false when releasing
  }

  watch() {
    const em = this;
    // 5 minutes to check the feed
    this.timeout = setInterval(() => {
      console.log("Updated RSS Feed");
      em.feed.updateFeed()
    }, 1 * 60e3);
    // 5 minutes to update the invasion statuses
    this.invasionTimeout = setInterval(() => {
      console.log("Updating invasions");
      EventManager.iBroadcaster.update();
    }, 0.15 * 60e3);
    // 5 minutes to clean the alert heap
    this.cleanTimeout = setInterval(() => {
      console.log("Checking heap");
      while (EventManager.broadcaster.heap.peek().expiration < Date.now()) {
        const deletion = EventManager.broadcast.heap.remove().messages;
        em.client.channels.get(deletion[0]).fetchMessage(deletion[1]).then((msg) => {
          msg.delete();
        })
      }
    }, 1 * 60e3);
  }
}

module.exports = EventManager;
