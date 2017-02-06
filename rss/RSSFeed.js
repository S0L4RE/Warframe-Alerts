class RSSFeed {
  constructor() {
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
}

module.exports = RSSFeed;
