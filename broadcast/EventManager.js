const { invasions, alerts } = require("./events.json");
const fs = require("fs");

const RSSFeed = require("./feed/RSSFeed.js");
const MessageBroadcaster = require("./MessageBroadcaster.js");
const InvasionBroadcaster = require("./InvasionBroadcaster.js");

class EventManager {
  constructor(client, type) {
    this.client = client;
    if (!EventManager.broadcaster)
      EventManager.broadcaster = new MessageBroadcaster(this.client, alerts); // shoud be static
    if (!EventManager.iBroadcaster)
      EventManager.iBroadcaster = new InvasionBroadcaster(this.client, invasions);
    this.feed = new RSSFeed(type, EventManager.broadcaster, EventManager.iBroadcaster);
    this.type = type;
    this.feed.updateFeed(false); // change to false when releasing
    if (!EventManager.fileUpdate) {
      EventManager.fileUpdate = setInterval(() => {
        const eventstuff = {
          invasions: EventManager.iBroadcaster.invasions,
          alerts: EventManager.broadcaster.heap.data
        }
        fs.writeFile(`./broadcast/events.json`, JSON.stringify(eventstuff), (err) => {
          if (err) return console.log(err);
        })
      }, 5 * 60e3);
    }
  }

  watch() {
    const em = this;
    // 5 minutes to check the feed
    this.timeout = setInterval(() => {
      em.feed.updateFeed();
    }, 5 * 60e3);
    // 5 minutes to update the invasion statuses
    this.invasionTimeout = setInterval(() => {
      const removed = EventManager.iBroadcaster.update();
      for (let i = 0; i < removed.length; i++) {
        const expiredMessages = removed[i][0];
        em.feed.events.delete(removed[i][1].guid);
        for (const [channel, id] of expiredMessages) {
          try {
            em.client.channels.get(channel).fetchMessage(id).then((msg) => {
              msg.delete();
            }).catch((err) => {
              console.error("couldn't find message id: ", id);
            })
          } catch(e) {
            console.error("couldn't find channel: ", channel);
          }
        }
      }
    }, 5 * 60e3);
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
            }).catch((err) => {
              console.error("couldn't find message id: ", id);
            })
          } catch(e) {
            console.error("couldn't find channel: ", channel);
          }
        }
      }
    }, 5 * 60e3);
  }
}

module.exports = EventManager;
