const RSSFeed = require("../rss/RSSFeed");
const rss = new RSSFeed();
setTimeout(function(){rss.updateFeed()}, 5000);

module.exports = {
  rssFeed: () => {
    setInterval(function(){rss.updateFeed()}, 10 * 1000 * 60);
  }
}
