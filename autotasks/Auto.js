const EventManager = require("../broadcast/EventManager.js");

module.exports = {
  eventFeed: (client) => {
    new EventManager(client).watch(60000);
  }
}
