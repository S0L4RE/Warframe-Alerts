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
    // this.update(false);
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
    console.log("wrote stuff to file.", "invasions: " + eventstuff.invasions.length, "alerts: " + eventstuff.alerts.length);
    fs.writeFile(`./broadcast/events.json`, JSON.stringify(eventstuff), (err) => {
      if (err) return console.log(err);
    })
  }

  checkInvasions() {
    return new Promise((resolve) => {
      this.iBroadcaster.update().then((removed) => {
        for (let i = 0; i < removed.length; i++) {
          const expiredMessages = removed[i][0];
          Object.values(this.feeds).forEach((feed) => feed.events.delete(removed[i][1].guid));
          for (const [channel, id] of expiredMessages) {
            try {
              this.client.channels.get(channel).fetchMessage(id).then((msg) => {
                msg.delete();
              }).catch((err) => {
                console.error("couldn't find message id: ", channel, id);
              })
            } catch(e) {
              console.error("couldn't find channel: ", channel);
            }
          }
        }
        resolve(removed.length > 0);
      })
    })
  }

  checkAlerts() {
    return new Promise((resolve) => {
      let removed = false;
      while (this.broadcaster.heap.peek() && this.broadcaster.heap.peek().expiration < Date.now()) {
        const deletion = this.broadcaster.heap.remove();
        removed = true;
        // iterate through messages
        Object.values(this.feeds).forEach((feed) => feed.events.delete(deletion.guid));
        for (const [channel, id] of deletion.messages) {
          try {
            this.client.channels.get(channel).fetchMessage(id).then((msg) => {
              msg.delete();
            }).catch((err) => {
              console.error("couldn't find message id: ", channel, id);
            })
          } catch(e) {
            console.error("couldn't find channel: ", channel);
          }
        }
      }
      resolve(removed);
    })
  }

  checkFeed() {
    return new Promise((resolve) => {
      this.update(true).then((shouldIUpdate) => {
        // if at least 1 true update
        Promise.all(shouldIUpdate).then((results) => {
          resolve(results.some((a) => a));
        })
      })
    })
  }

  watch() {
    this.timeout = setInterval(() => {
      Promise.all([this.checkFeed(), this.checkAlerts(), this.checkInvasions()]).then((shouldIUpdates) => {
        if (shouldIUpdates.some((a) => a)) { // if at least 1 true
          this.save();
        }
      })
    }, 0.5 * 60e3);
  }
}

module.exports = EventManager;
