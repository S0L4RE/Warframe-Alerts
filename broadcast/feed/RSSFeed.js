const parseString = require("xml2js").parseString;
const superagent = require("superagent");
const AlertEvent = require("../events/AlertEvent.js");

class RSSFeed {
  constructor(type = "pc", broadcaster) {
    if (type === "pc") {
      this.updateURL = "http://content.warframe.com/dynamic/rss.php";
    } else if (type === "ps4") {
      this.updateURL = "http://content.ps4.warframe.com/dynamic/rss.php";
    } else if (type === "xb1") {
      this.updateURL = "http://content.xb1.warframe.com/dynamic/rss.php";
    } else {
      throw new Error("invalid rss feed type");
    }
    this.type = type;
    this.events = new Set();
    this.broadcaster = broadcaster;
  }

  broadcast(event) {
    this.broadcaster.broadcast(event);
  }

  updateFeed(broadcast = true) {
    superagent.get(this.updateURL).type("xml").buffer().end((err, content) => {
      if (err) return console.error(err);
      parseString(content.text, (err, result) => {
        if (err) return console.error(err);
        const events = result.rss.channel[0].item;
        // events is an array of event information
        // for alerts its like this
        /*
        { guid: [ '58e555e5f0b9968d98973027' ],
          title: [ '14600cr - Kelpie (Sedna) - 58m' ],
          author: [ 'Alert' ],
          description: [ 'Examine Facility Network Protocols' ],
          pubDate: [ 'Wed, 05 Apr 2017 20:43:19 +0000' ],
          'wf:faction': [ 'FC_GRINEER' ],
          'wf:expiry': [ 'Wed, 05 Apr 2017 21:41:48 +0000' ] }
         */
        // and invasions this
        /*
        { guid: [ '58e534256ad6bb2334e1a0b2' ],
          author: [ 'Outbreak' ],
          title: [ '3x Detonite Injector - PHORID SPAWN War (Mars)' ],
          pubDate: [ 'Wed, 05 Apr 2017 18:15:01 +0000' ] }
        { guid: [ '58e31a418612697548d65715' ],
          author: [ 'Invasion' ],
          title: [ 'Corpus (Snipetron Vandal Receiver) VS. Infestation - Armaros (Europa)' ],
          pubDate: [ 'Wed, 05 Apr 2017 16:01:05 +0000' ] }
         */
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          if (this.events.has(event.guid[0])) continue;
          this.events.add(event.guid[0]);
          let newEvent;
          if (event.author[0] === "Alert") {
            newEvent = new AlertEvent(event.guid[0], event.author[0], event.title[0],
              Date.now(), event.description[0], event["wf:faction"][0], event["wf:expiry"][0], this.type);
          } else { // outbreak or invasion
            // newEvent = new InvasionEvent(event.guid[0], event.author[0], event.title[0], Date.now(), this.type);
          }
          if (broadcast && newEvent !== undefined) this.broadcast(newEvent);
        }
      })
    });
  }
}

module.exports = RSSFeed;
