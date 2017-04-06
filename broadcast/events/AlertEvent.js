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
    this.location = title[title.length - 2];
    this.rewards = [];
    for (let idx = 0; idx < title.length - 2; idx++) {
      this.rewards.push(title[idx]);
    }
  }

  toString() {
    return `\`\`\`diff\n-!- [${this.type}] -!-
+ ${this.description}
+ on ${this.location}
*** [Rewards] ***
+ ${this.rewards.join("\n+ ")}
*** [Duration] ***
+ ${this.dur.replace("m", " minutes")}\`\`\``;
  }
}

module.exports = AlertEvent;
