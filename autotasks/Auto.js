const RSSFeed = require("../rss/RSSFeed");
const rss = new RSSFeed();
let bot;
setTimeout(function(){rss.updateFeed(bot, true)}, 30000); // 30 second startup delay and no broadcast

module.exports = {
  rssFeed: (b) => {
    bot = b;
    setInterval(function(){rss.updateFeed(bot)}, 10 * 1000 * 60);
  }
}
