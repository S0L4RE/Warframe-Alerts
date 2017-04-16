const { invasions, alerts } = require("./events.json");
const fs = require("fs");

const RSSFeed = require("./feed/RSSFeed.js");
const MessageBroadcaster = require("./MessageBroadcaster.js");
const InvasionBroadcaster = require("./InvasionBroadcaster.js");

class EventManager {
  constructor(client) {
    this.client = client;
    this.broadcaster = new MessageBroadcaster(this.client, alerts, this); // shoud be static
    this.iBroadcaster = new InvasionBroadcaster(this.client, invasions, this);
    this.feeds =  {
      "pc": new RSSFeed("pc", this.broadcaster, this.iBroadcaster),
      "xb1": new RSSFeed("xb1", this.broadcaster, this.iBroadcaster),
      "ps4": new RSSFeed("ps4", this.broadcaster, this.iBroadcaster)
    }
    this.update(false);
  }

  update(br) {
    // an array of promises which resolves to
    //   true: if feed has added something
    //   false: if feed hasnt added something
    return Promise.resolve(Object.values(this.feeds).map((feed) => feed.updateFeed(br)));
  }

  save() {
    const eventstuff = {
      invasions: this.iBroadcaster.invasions,
      alerts: this.broadcaster.heap.data
    }
    console.log("wrote stuff to file.", eventstuff.invasions.length, eventstuff.alerts.length);
    fs.writeFile(`./broadcast/events.json`, JSON.stringify(eventstuff), (err) => {
      if (err) return console.log(err);
    })
  }

  watch() {
    const em = this;
    // 5 minutes to check the feed
    this.timeout = setInterval(() => {
      em.update(true).then((shouldIUpdate) => {
        // if at least 1 true update
        Promise.all(shouldIUpdate).then((results) => {
          if (results.some((a) => a)) {
            this.save();
          }
        })
      });
    }, 5 * 60e3);

    // 5 minutes to update the invasion statuses
    this.invasionTimeout = setInterval(() => {
      const removed = this.iBroadcaster.update();
      for (let i = 0; i < removed.length; i++) {
        const expiredMessages = removed[i][0];
        em.feed.events.delete(removed[i][1].guid);
        for (const [channel, id] of expiredMessages) {
          try {
            em.client.channels.get(channel).fetchMessage(id).then((msg) => {
              msg.delete();
            }).catch((err) => {
              console.error("couldn't find message id: ", channel, id);
            })
          } catch(e) {
            console.error("couldn't find channel: ", channel);
          }
        }
      }
      if (removed.length > 0) this.save();
    }, 5 * 60e3);

    // 5 minutes to clean the alert heap
    this.cleanTimeout = setInterval(() => {
      let removed = false;
      while (this.broadcaster.heap.peek() && this.broadcaster.heap.peek().expiration < Date.now()) {
        const deletion = this.broadcaster.heap.remove();
        removed = true;
        // iterate through messages
        Object.values(this.feeds).forEach((feed) => feed.events.delete(deletion.guid));
        for (const [channel, id] of deletion.messages) {
          try {
            em.client.channels.get(channel).fetchMessage(id).then((msg) => {
              msg.delete();
            }).catch((err) => {
              console.error("couldn't find message id: ", channel, id);
            })
          } catch(e) {
            console.error("couldn't find channel: ", channel);
          }
        }
      }
      if (removed) this.save();
    }, 5 * 60e3);
  }
}

module.exports = EventManager;
