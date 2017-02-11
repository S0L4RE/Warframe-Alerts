const RSSFeed = require("../rss/RSSFeed");
const WorldState = require("../ws/ws");
const BroadcastMessage = require("../broadcast/BroadcastMessage");
const rss = new RSSFeed();
let bot;

let pc_found = true;
let ps4_found = true;

module.exports = {
  rssFeed: (b) => {
    bot = b;
    setTimeout(function(){rss.updateFeed(bot, false)}, 10000); // 10 second startup delay and no broadcast
    setInterval(function(){rss.updateFeed(bot)}, 10 * 1000 * 60);
  },
  worldState: () => {
    WorldState.updateWorldState();
    setInterval(WorldState.updateWorldState, 9 * 1000 * 60);
  },
  acolyte: () => {
    setInterval(function(){
      WorldState.updateWorldState();
      console.log("checking acolytes");
      let persistent = WorldState.getWs().PersistentEnemies;
      if (!persistent) return;
      for (let idx = 0; idx < persistent.length; idx++) {
        // console.log(`PC: checking ${JSON.stringify(persistent[idx],null,2)}`);
        if (persistent[idx].Discovered && !pc_found) {
          pc_found = true;
          let bm = new BroadcastMessage(bot);
          let msg = `\`\`\`diff\n`;
          msg += `- PC: ${persistent[idx].AgentType}\n`;
          msg += `+ [Location]: ${persistent[idx].LastDiscoveredLocation}\n`;
          msg += `+ [Health %]: ${persistent[idx].HealthPercent}\n`;
          msg += `+ [Reward]: acolyte`
          msg += `\`\`\``;
          bm.broadcast(msg);
        } else if (!persistent[idx].Discovered) {
          console.log("PC hid");
          pc_found = false;
        }
      }
      persistent = WorldState.getPS4Ws().PersistentEnemies;
      if (!persistent) return;
      for (let idx = 0; idx < persistent.length; idx++) {
        // console.log(`PS4: checking ${JSON.stringify(persistent[idx],null,2)}`);
        if (persistent[idx].Discovered && !ps4_found) {
          ps4_found = true;
          console.log("PS4 found");
          let bm = new BroadcastMessage(bot);
          let msg = `\`\`\`diff\n`;
          msg += `- PS4: ${persistent[idx].AgentType}\n`;
          msg += `+ [Location]: ${persistent[idx].LastDiscoveredLocation}\n`;
          msg += `+ [Health %]: ${persistent[idx].HealthPercent}\n`;
          msg += `+ [Reward]: PS4colyte`
          msg += `\`\`\``;
          bm.broadcast(msg);
        } else if (!persistent[idx].Discovered) {
          console.log("PS4 hid");
          ps4_found = false;
        }
      }
    }, 1 * 1000 * 60);
  }
}
