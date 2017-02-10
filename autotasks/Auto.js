const RSSFeed = require("../rss/RSSFeed");
const WorldState = require("../ws/ws");
const rss = new RSSFeed();
let bot;

module.exports = {
  rssFeed: (b) => {
    bot = b;
    setTimeout(function(){rss.updateFeed(bot, false)}, 10000); // 10 second startup delay and no broadcast
    setInterval(function(){rss.updateFeed(bot)}, 10 * 1000 * 60);
  },
  worldState: () => {
    WorldState.updateWorldState();
    setInterval(WorldState.updateWorldState, 9 * 1000 * 60);
  }
}
