const RSSEvent = require("./RSSEvent.js");

class AlertEvent extends RSSEvent {
  constructor(guid, author, title, pubDate, description, wffaction, wfexpiry, type) {
    super(guid, author, title, pubDate);
    this.description = description;
    this.faction = wffaction;
    this.expiry = wfexpiry;
    this.platform_type = type;
    title = title.split(" - ");
    this.dur = title[title.length - 1];
  }

  toString() {
    let title = this.title.split(" - ");
    let content = `\`\`\`diff\n-!- [${this.type}] -!-
+ ${this.description}
+ on ${title[title.length - 2]}
*** [Rewards] ***\n`;
    for (let idx = 0; idx < title.length - 2; idx++) {
      content += `+ ${title[idx]}\n`;
    }
    content += `*** [Duration] ***
+ ${title[title.length - 1]}\`\`\``;
    return content;
  }
}

module.exports = AlertEvent;
