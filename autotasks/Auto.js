const EventManager = require("../broadcast/EventManager.js");

module.exports = {
  eventFeed: (client) => {
    new EventManager(client, "pc").watch();
    new EventManager(client, "xb1").watch();
    new EventManager(client, "ps4").watch();
  }
}
