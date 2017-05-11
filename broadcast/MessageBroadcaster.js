const { RichEmbed } = require("discord.js");
const EventHeap = require("./EventHeap.js");
const EventHeapObj = require("./EventHeapObj.js");
const matchRoles = require("./RoleFinder.js").matchRoles;

class MessageBroadcaster {
    constructor(bot, alerts = [], manager) {
        this.client = bot;
        this.manager = manager;
        this.heap = new EventHeap(alerts);
        console.log(`[EVENT HEAP LOAD] ${this.heap.length} events`);
    }

    async broadcast(event) {
        let pMessages = [];
        let color = 0x00ffff;
        if (event.rewards.length === 1) color = 0x00ffff;
        else if (event.rewards.length > 2) color = 0xff0000;
        this.client.guilds.forEach(guild => {
            const mentions = matchRoles(event, guild);
            const channel = guild.channels.find(c => c.name === `${event.platform_type}_wf_alerts` && c.type === "text");
            if (!channel) return;
            try {
                pMessages.push(channel.send(mentions.join(" "), {
                    embed: new RichEmbed().setColor(color).setTimestamp().setFooter(event.guid).setDescription(event.toString())
                }));
            } catch (e) {
                // console.error(e);
            }
        })
        pMessages = pMessages.map(p => {
            return p.then(msg => msg).catch(() => "BIGERR919");
        })
        let results = await Promise.all(pMessages);
        results = results.filter(v => v !== "BIGERR919");
        results = results.map(m => [m.channel.id, m.id]);
        this.heap.insert(new EventHeapObj(results, event.date + parseInt(event.dur.replace("m", "") * 60e3, event.guid)));
        return "FIN";
    }
}

module.exports = MessageBroadcaster;
