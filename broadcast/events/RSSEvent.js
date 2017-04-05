class RSSEvent {
  constructor(guid, author, title, pubDate) {
    this.guid = guid;
    this.type = author;
    this.title = title;
    this.date = pubDate;
  }
}

module.exports = RSSEvent;
