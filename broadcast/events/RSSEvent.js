const { roles } = require("../allowed_roles.json");

class RSSEvent {
  constructor(guid, author, title, pubDate) {
    this.guid = guid;
    this.type = author;
    this.title = title;
    this.date = pubDate;
  }

  rewardMentions() {
    return roles.filter((role) => this.rewards.some((reward) => reward.includes(role)));
  }
}

module.exports = RSSEvent;
