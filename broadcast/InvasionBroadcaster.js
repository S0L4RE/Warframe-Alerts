const WorldState = require("../worldstate/Worldstate.js");
const matchRoles = require("./RoleFinder.js").matchRoles;

class InvasionBroadcaster {
    constructor(bot, invasions = [], manager) {
        this.client = bot;
        this.invasions = invasions;
        this.manager = manager;
        console.log(`[INVASION LIST LOAD] ${this.invasions.length} events`);
        WorldState.update();
    }

    async broadcast(event) {
        let pMessages = [];
        this.client.guilds.forEach(guild => {
            const mentions = matchRoles(event, guild);
            const channel = guild.channels.find(c => c.name === `${event.platform_type}_wf_alerts` && c.type === "text");
            if (!channel) return;
            try {
                pMessages.push(channel.send(mentions.join(" ") + event.toString()));
            } catch (e) {
                console.error(e);
            }
        })
        pMessages = pMessages.map(p => {
            return p.then(msg => msg).catch(() => "BIGERR919");
        })
        let results = await Promise.all(pMessages);
        results.filter(v => v !== "BIGERR919");
        results = results.map(m => [m.channel.id, m.id]);
        this.invasions.push([results, event]);
        return "FIN";
    }

    async update() {
        await WorldState.update();
        const expired = [];
        const currentInvasions = WorldState.getWs["pc"]().Invasions.concat(WorldState.getWs["xb1"]().Invasions, WorldState.getWs["ps4"]().Invasions);
        const currentGUIDS = currentInvasions.map(i => i["_id"]["$oid"]);
        for (let i = 0; i < this.invasions.length; i++) {
            const index = currentGUIDS.indexOf(this.invasions[i][1].guid);
            if (index < 0 || currentInvasions[index].Completed) {
                const [removable] = this.invasions.splice(i--, 1);
                if (index >= 0) expired.push(removable);
                continue;
            }
            const matched = currentInvasions[index];
            const status = matched.Count;
            const max = matched.Goal;
            const width = 80;
            const progress = width * (status + max) / (max * 2) << 0;
            const event = this.invasions[i][1];
            const content1 = event.type.toLowerCase();
            const content2 = event.location;
            let rewardLine;
            if (event.rewards.length === 1) {
                rewardLine = `-${' '.repeat(width / 2 - event.rewards[0].length / 2 - 2)}${event.rewards[0]}${' '.repeat(width / 2 - event.rewards[0].length / 2)}-`;
            } else {
                rewardLine = `-${event.rewards[0]}${' '.repeat(width - event.rewards[0].length - event.rewards[1].length - 2)}${event.rewards[1]}-`;
            }
            let progressLine = `${"O".repeat(Math.abs(progress))} ${"0".repeat(Math.abs(width - progress - 1))}`;
            for (const [channel, id] of this.invasions[i][0]) {
                try {
                    const message = await this.client.channels.get(channel).fetchMessage(id);
                    const mentions = matchRoles(event, message.guild);
                    message.edit([mentions.join(" "),
                        "```haskell",
                        content1,
                        content2,
                        rewardLine,
                        progressLine,
                        "```"
                    ]);
                } catch (e) {
                    console.error(e);
                }
            }
        }
        return expired;
    }
}

module.exports = InvasionBroadcaster;
