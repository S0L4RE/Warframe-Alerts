const RSSFeed = require("../rss/RSSFeed");
const rss = new RSSFeed();
setTimeout(function(){rss.updateFeed(false)}, 30000); // 30 second startup delay and no broadcast

module.exports = {
  rssFeed: () => {
    setInterval(function(){rss.updateFeed()}, 10 * 1000 * 60);
  }
}
