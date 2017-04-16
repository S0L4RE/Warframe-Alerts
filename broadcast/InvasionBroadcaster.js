const WorldState = require("../worldstate/Worldstate.js");
const matchRoles = require("./RoleFinder.js").matchRoles;
WorldState.update();

class InvasionBroadcaster {
  constructor(bot, invasions = [], manager) {
    this.client = bot;
    this.invasions = invasions;
    this.manager = manager;
    console.log(`Loaded InvasionBroadcaster with ${this.invasions.length} events!`);
  }

  broadcast(event) {
    return new Promise((resolve) => {
      let pMessages = [];
      this.client.guilds.forEach((guild) => {
        const mentions = matchRoles(event, guild);
        const channel = guild.channels.find("name", `${event.platform_type}_wf_alerts`);
        if (!channel) return;
        pMessages.push(channel.send(mentions.join(" ") + event.toString()));
      })
      // handle errors and stuff
      pMessages = pMessages.map((p) => {
        return p.then((msg) => msg).catch(() => "BIGERR");
      })
      const ib = this;
      Promise.all(pMessages).then((messages) => {
        messages = messages.filter((v) => v !== "BIGERR");
        messages = messages.map((m) => [m.channel.id, m.id]);
        this.invasions.push([messages, event]);
        resolve("Finished invasion broadcast");
      })
    })
  }

  update() {
    // read worldstate and update all invasion statuses
    // things that arent updated are removed from the map
    // well i mean you can just make a new map based on world state
    // information probably
    WorldState.update();
    // yeah wont actually update it in time because callbacks
    // but no one will ever know!!!!
    let expired = [];
    // ok so the real idea is 1 invasion broadcaster for all platforms
    // so concat all invasion arrays to make a "master" array
    const currentInvasions = WorldState.getWs["pc"]().Invasions.concat(WorldState.getWs["xb1"]().Invasions, WorldState.getWs["ps4"]().Invasions);
    const currentGUIDS = currentInvasions.map((i) => i["_id"]["$oid"]);
    for (let i = 0; i < this.invasions.length; i++) {
      const idx = currentGUIDS.indexOf(this.invasions[i][1].guid);
      // if this invasion doesnt exist on the world state
      if (idx < 0 || currentInvasions[idx].Completed) {
        const [removable] = this.invasions.splice(i, 1);
        if (idx >= 0 && currentInvasions[idx].Completed) { // delete messages if expired
          expired.push(removable);
        }
        i--;
        continue;
      }
      const matched = currentInvasions[idx];
      const status = matched.Count;
      const max = matched.Goal;
      const width = 80;
      const progress = width * (status + max) / (max * 2) << 0;
      const event = this.invasions[i][1];
      let content1 = /* " ".repeat((width / 2 << 0) - (event.type.length / 2)) + */ event.type.toLowerCase();
      let content2 = event.location;
      let rewardLine = "";
      if (event.rewards.length === 1) {
        rewardLine = `-${' '.repeat(width / 2 - event.rewards[0].length / 2 - 2)}${event.rewards[0]}${' '.repeat(width / 2 - event.rewards[0].length / 2)}-`;
      } else {
        rewardLine = `-${event.rewards[0]}${' '.repeat(width - event.rewards[0].length - event.rewards[1].length - 2)}${event.rewards[1]}-`;
      }
      let progressLine = `${"O".repeat(Math.abs(width - progress - 1))} ${"0".repeat(Math.abs(progress))}`;
      // loop here maybe
      /*
      invasions = [
        [ [ [channel, id], [channel, id] ], event]
      ]
       */
      for (const [channel, id] of this.invasions[i][0]) {
        try {
          const chan = this.client.channels.get(channel);
          const mentions = matchRoles(event, chan.guild);
          chan.fetchMessage(id).then((msg) => {
            msg.edit(mentions.join(" ") + `\`\`\`haskell
${content1}
${content2}
${rewardLine}
${progressLine}
\`\`\``
            );
          }).catch((err) => {
            console.error("(ud) couldn't find message id: ", channel, id);
          })
        } catch(e) {
          console.error("(ud) couldn't find channel: ", channel);
        }
      }
    }
    return expired;
  }
}

module.exports = InvasionBroadcaster;
