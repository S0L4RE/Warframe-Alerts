const RSSFeed = require("./feed/RSSFeed.js");
const MessageBroadcaster = require("./MessageBroadcaster.js");
const InvasionBroadcaster = require("./InvasionBroadcaster.js");

class EventManager {
  constructor(client, type) {
    this.client = client;
    if (!EventManager.broadcaster)
      EventManager.broadcaster = new MessageBroadcaster(this.client); // shoud be static
    if (!EventManager.iBroadcaster)
      EventManager.iBroadcaster = new InvasionBroadcaster(this.client);
    this.feed = new RSSFeed(type, EventManager.broadcaster, EventManager.iBroadcaster);
    this.feed.updateFeed(false); // change to false when releasing
  }

  watch() {
    const em = this;
    // 5 minutes to check the feed
    this.timeout = setInterval(() => {
      em.feed.updateFeed()
    }, 3 * 60e3);
    // 5 minutes to update the invasion statuses
    this.invasionTimeout = setInterval(() => {
      const removed = EventManager.iBroadcaster.update();
      for (let i = 0; i < removed.length; i++) {
        const expiredMessages = removed[i][0];
        const guid = remove[i][1];
        em.feed.events.delete(guid);
        for (const [[channel, id]] of expiredMessages) {
          try {
            em.client.channels.get(channel).fetchMessage(id).then((msg) => {
              msg.delete();
            })
          } catch(e) {
            console.log(e);
          }
        }
      }
    }, 3 * 60e3);
    // 5 minutes to clean the alert heap
    this.cleanTimeout = setInterval(() => {
      while (EventManager.broadcaster.heap.peek() && EventManager.broadcaster.heap.peek().expiration < Date.now()) {
        const deletion = EventManager.broadcaster.heap.remove();
        // iterate through messages
        em.feed.events.delete(deletion.guid);
        for (const [channel, id] of deletion.messages) {
          try {
            em.client.channels.get(channel).fetchMessage(id).then((msg) => {
              msg.delete();
            })
          } catch(e) {
            console.log(e);
          }
        }
      }
    }, 3 * 60e3);
  }
}

module.exports = EventManager;
