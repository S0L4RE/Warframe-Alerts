const { RichEmbed } = require("discord.js");
const EventHeap = require("./EventHeap.js");
const EventHeapObj = require("./EventHeapObj.js");
const matchRoles = require("./RoleFinder.js").matchRoles;

class MessageBroadcaster {
  constructor(bot, alerts = [], manager) {
    this.client = bot;
    this.manager = manager;
    this.heap = new EventHeap(alerts);
  }

  broadcast(event) {
    return new Promise((resolve) => {
      // maybe instead of each guild just search the client.channel collection
      let color = 0x000000; // should be black
      if (event.rewards.length > 1) color = 0x00ffff; // light bluish
      if (event.rewards.length > 2) color = 0xff0000; // red
      let pMessages = [];
      this.client.guilds.forEach((guild) => {
        const mentions = matchRoles(event, guild);
        const channel = guild.channels.find("name", `${event.platform_type}_wf_alerts`);
        if (!channel) return;
        pMessages.push(channel.send(mentions.join(" "), {embed: new RichEmbed().setColor(color).setTimestamp().setFooter(event.guid).setDescription(event.toString())}));
      })
      // handle errors and stuff
      pMessages = pMessages.map((p) => {
        return p.then((msg) => msg).catch(() => "BIGERR");
      })
      Promise.all(pMessages).then((messages) => {
        messages = messages.filter((v) => v !== "BIGERR");
        messages = messages.map((m) => [m.channel.id, m.id]); // need chanenl to fetch and remove
        // messages is now an array of all message ids
        this.heap.insert(new EventHeapObj(messages, event.date + parseInt(event.dur.replace("m", "") * 60e3, event.guid)));
        resolve("Finished alert broadcast");
      })
    })
  }
}

module.exports = MessageBroadcaster;
