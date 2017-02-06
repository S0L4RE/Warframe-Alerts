const AlertEvent = require("./AlertEvent");
const InvasionEvent = require("./InvasionEvent");
const RSSFeed = require("./RSSFeed");
const parseString = require("xml2js").parseString;
const request = require("request");

const feed = new RSSFeed();

function readFeed() {
  request({uri: "http://content.warframe.com/dynamic/rss.php"}, (err, response, body) => {
    if (err) return console.error(err);
    if (response.statusCode != 200) return console.error(response);
    parseString(body, (err, result) => {
      if (err) return console.error(err);
      let events = result.rss.channel[0].item; // an array of alert/invasion events
      for (let idx = 0; idx < events.length; idx++) {
        // author - invasion/alert/outbreak
        // guid - guid
        // title - rewards/factions
        // pubDate - when published
        // not really interested in anything else
        let event = events[idx];
        let newEvent;
        // console.log(event);
        if (event.author[0] === "Alert") { // whats with the arrays? idk
          newEvent = new AlertEvent(event.guid[0], event.author[0], event.title[0], event.pubDate[0],
            event.description[0], event["wf:faction"][0], event["wf:expiry"][0]);
        } else {
          newEvent = new InvasionEvent(event.guid[0], event.author[0], event.title[0], event.pubDate[0]);
        }
        if (feed.addEvent(newEvent)) { // returns false if its already in the feed!
          newEvent.broadcast();
        }
      }
    })
  })
}

readFeed();
