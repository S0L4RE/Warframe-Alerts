const { RichEmbed } = require("discord.js");
const EventHeap = require("./EventHeap.js");
const EventHeapObj = require("./EventHeapObj.js");

class MessageBroadcaster {
  constructor(bot) {
    this.client = bot;
    this.heap = new EventHeap();
  }

  broadcast(event) {
    const pMessages = [];
    this.client.guilds.forEach((guild) => {
      const channel = guild.channels.find("name", `${event.platform_type}_wf_alerts`);
      if (!channel) return;
      pMessages.push(channel.sendMessage(event.toString(),
        {embed: new RichEmbed().setTimestamp().setFooter(event.guid)}));
    })
    Promise.all(pMessages).then((messages) => {
      messages = messages.map((m) => m.id);
      // messages is now an array of all message ids
      this.heap.insert(new EventHeapObj(messages, event.date + parseInt(event.dur.replace("m", "") * 60e3)));
    })
  }
}

module.exports = MessageBroadcaster;
