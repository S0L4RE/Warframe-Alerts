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
        this.feeds = {
            "pc": new RSSFeed("pc", this.broadcaster, this.iBroadcaster),
            "xb1": new RSSFeed("xb1", this.broadcaster, this.iBroadcaster),
            "ps4": new RSSFeed("ps4", this.broadcaster, this.iBroadcaster)
        }
        this.update(false);
    }

    update(br) {
        // promises
        return Object.values(this.feeds).map((feed) => feed.updateFeed(br));
    }

    save() {
        const eventstuff = {
            invasions: this.iBroadcaster.invasions,
            alerts: this.broadcaster.heap.data
        }
        fs.writeFile(`./broadcast/events.json`, JSON.stringify(eventstuff), (err) => {
            if (err) return console.error(err);
        })
    }

    async checkInvasions() {
        const removedInvasions = await this.iBroadcaster.update();
        for (let i = 0; i < removedInvasions.length; i++) {
            const expiredMessages = removedInvasions[i][0];
            // remove the guid located in the RSS feed
            Object.values(this.feeds).forEach(feed => feed.events.delete(removedInvasions[i][1].guid));
            for (const [channel, id] of expiredMessages) {
                try {
                    const message = await this.client.channels.get(channel).fetchMessage(id);
                    message.delete();
                } catch (e) {
                    console.error(e);
                }
            }
        }
        return removedInvasions.length > 0;
    }

    async checkAlerts() {
        let removed = 0;
        while (this.broadcaster.heap.peek() && this.broadcaster.heap.peek().expiration < Date.now()) {
            removed++;
            const deleted = this.broadcaster.heap.remove();
            Object.values(this.feeds).forEach(feed => feed.events.delete(deleted.guid));
            for (const [channel, id] of deleted.messages) {
                try {
                    const message = await this.client.channels.get(channel).fetchMessage(id);
                    message.delete();
                } catch (e) {
                    console.error(e);
                }
            }
        }
        return removed > 0;
    }


    async checkFeed() {
        const results = await Promise.all(this.update(true));
        return results.some(a => a.length > 0);
    }

    watch(time) {
        this.timeout = setInterval(async () => {
            const results = await Promise.all([this.checkFeed(), this.checkAlerts(), this.checkInvasions()]);
            if (results.some(a => a)) this.save();
        }, time || 5 * 60e3);
    }
}

module.exports = EventManager;
