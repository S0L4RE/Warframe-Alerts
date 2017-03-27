const RSSFeed = require("../rss/RSSFeed");
const WorldState = require("../ws/ws");
const BroadcastMessage = require("../broadcast/BroadcastMessage");
const pc_rss = new RSSFeed("http://content.warframe.com/dynamic/rss.php", "PC");
const ps4_rss = new RSSFeed("http://content.ps4.warframe.com/dynamic/rss.php", "PS4");
const xb1_rss = new RSSFeed("http://content.xb1.warframe.com/dynamic/rss.php", "XB1");
let bot;

let pc_found = {};
let ps4_found = {};
/*
treat like
{
"/Lotus/Types/Enemies/Acolytes/HeavyAcolyteAgent": true

}
 */
module.exports = {
  rssFeed: (b) => {
    bot = b;
    setTimeout(function(){pc_rss.updateFeed(bot, false);
      ps4_rss.updateFeed(bot, false);
      xb1_rss.updateFeed(bot, false);
    }, 10000); // 10 second startup delay and no broadcast
    setInterval(function(){pc_rss.updateFeed(bot);
      ps4_rss.updateFeed(bot);
      xb1_rss.updateFeed(bot);
      console.log("Updated ws information");
    }, 5 * 1000 * 60);
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
        let found = pc_found[persistent[idx].AgentType]; // either true or falsr or null by default false so we run off discovered
        if (found === undefined) found = true;
        if (persistent[idx].Discovered && !found) {
          pc_found[persistent[idx].AgentType] = true;
          let bm = new BroadcastMessage(bot);
          let msg = `\`\`\`diff\n`;
          msg += `- PC: ${persistent[idx].AgentType}\n`;
          msg += `+ [Location]: ${persistent[idx].LastDiscoveredLocation}\n`;
          msg += `+ [Health %]: ${persistent[idx].HealthPercent}\n`;
          msg += `+ [PC_Title]: acolyte`
          msg += `\`\`\``;
          bm.broadcast(msg);
        } else if (!persistent[idx].Discovered && found) {
          let bm = new BroadcastMessage(bot);
          console.log("PC hid");
          let msg = `\`\`\`diff\n`;
          msg += `- PC: ${persistent[idx].AgentType}\n`;
          msg += `+ HIDDEN +`;
          msg += `\`\`\``;
          bm.broadcast(msg);
          pc_found[persistent[idx].AgentType] = false;
        }
      }
      persistent = WorldState.getPS4Ws().PersistentEnemies;
      if (!persistent) return;
      for (let idx = 0; idx < persistent.length; idx++) {
        // console.log(`PS4: checking ${JSON.stringify(persistent[idx],null,2)}`);
        let found = ps4_found[persistent[idx].AgentType];
        if (found === null) found = true;
        if (persistent[idx].Discovered && !found) { // if hes found and we thought he was hidden then say so
          ps4_found[persistent[idx].AgentType] = true;
          console.log("PS4 found");
          let bm = new BroadcastMessage(bot);
          let msg = `\`\`\`diff\n`;
          msg += `- PS4: ${persistent[idx].AgentType}\n`;
          msg += `+ [Location]: ${persistent[idx].LastDiscoveredLocation}\n`;
          msg += `+ [Health %]: ${persistent[idx].HealthPercent}\n`;
          msg += `+ [PS4_Title]: acolyte`
          msg += `\`\`\``;
          bm.broadcast(msg);
        } else if (!persistent[idx].Discovered && found) { // if hes not found and we thought he was found, say hes hidden
          let bm = new BroadcastMessage(bot);
          console.log("PS4 hid");
          let msg = `\`\`\`diff\n`;
          msg += `- PS4: ${persistent[idx].AgentType}\n`;
          msg += `+ HIDDEN +`;
          msg += `\`\`\``;
          bm.broadcast(msg);
          ps4_found[persistent[idx].AgentType] = false;
        }
      }
    }, 1 * 1000 * 10);
  }
}
