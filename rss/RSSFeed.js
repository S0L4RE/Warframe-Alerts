const AlertEvent = require("./AlertEvent");
const InvasionEvent = require("./InvasionEvent");
const parseString = require("xml2js").parseString;
const request = require("request");

class RSSFeed {
  // ok make several different RSS feeds that will update their own things
  // this SHOULD handle ps4, xb1
  // really i should just make the url based on the type but whateVER
  constructor(url = "http://content.warframe.com/dynamic/rss.php", type = "PC") {
    this.updateURL = url;
    this.type = type;
    this.events = [];
  }

  /**
   * add an event to the current feed
   * @param {Event} event the event to add
   * @return {Event} the event that was added
   */
  addEvent(event) {
    // check if event already exists
    for (let idx = 0; idx < this.events.length; idx++) {
      if (this.events[idx].guid === event.guid) {
        return false;
      }
    }
    if (typeof event === "object") {
      this.events.push(event);
    }
    return event;
  }

  /**
   * remove an event from the current feed
   * @param {number} guid the guid to remove
   * @return {Event} the event that was removed
   */
  removeEvent(guid) {
    if (typeof guid === "string") {
      for (let idx = 0; idx < this.events.length; idx++) {
        if (this.events[idx].guid === guid) {
          let ev = this.events[idx];
          this.events.slice(idx, 1);
          return ev;
        }
      }
    }
  }

  /**
   * update the RSS feed stored in memory
   * @param {boolean} broadcast whether or not to broadcast
   */
  updateFeed(bot, broadcast = true) {
    if (!broadcast) {
      let bm = require("../broadcast/BroadcastMessage.js");
      new bm(bot).broadcast("**Just restarted bot, ignore alerts and other things above this**");
    }
    request({uri: this.updateURL}, (err, response, body) => {
      if (err) return console.error(err);
      if (response.statusCode != 200) return console.error(response);
      parseString(body, (err, result) => {
        if (err) return console.error(err);
        let events = result.rss.channel[0].item; // an array of alert/invasion events
        let newFeed = new RSSFeed();
        let newEventCount = 0;
        for (let idx = 0; idx < events.length; idx++) {
          // author - invasion/alert/outbreak
          // guid - guid
          // title - rewards/factions
          // pubDate - when published
          // not really interested in anything else
          let event = events[idx];          // console.log(event);
          let newEvent;
          if (event.author[0] === "Alert") { // whats with the arrays? idk
            newEvent = new AlertEvent(event.guid[0], event.author[0], event.title[0], event.pubDate[0],
              event.description[0], event["wf:faction"][0], event["wf:expiry"][0], this.type);
          } else {
            newEvent = new InvasionEvent(event.guid[0], event.author[0], event.title[0], event.pubDate[0], this.type);
          }
          newFeed.addEvent(newEvent);
          if (this.addEvent(newEvent) && broadcast) { // returns false if its already in the feed!
            newEvent.broadcast(bot);
          }
        }
        this.events = newFeed.events;
      })
    })
  }
}

module.exports = RSSFeed;
