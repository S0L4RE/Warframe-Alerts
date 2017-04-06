const WorldState = require("../worldstate/Worldstate.js");
WorldState.update();

class InvasionBroadcaster {
  constructor(bot) {
    this.client = bot;
    this.invasions = [];
  }

  broadcast(event) {
    const pMessages = [];
    this.client.guilds.forEach((guild) => {
      const channel = guild.channels.find("name", `${event.platform_type}_wf_alerts`);
      if (!channel) return;
      pMessages.push(channel.send(event.toString()));
    })
    Promise.all(pMessages).then((messages) => {
      messages = messages.map((m) => [m.channel.id, m.id]);
      this.invasions.push([messages, event]);
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
    const currentInvasions = WorldState.getWs["pc"]().Invasions;
    const currentGUIDS = currentInvasions.map((i) => i["_id"]["$oid"]);
    for (let i = 0; i < this.invasions.length; i++) {
      const idx = currentGUIDS.indexOf(this.invasions[i][1].guid);
      // if this invasion doesnt exist on the world state
      if (idx < 0 || currentInvasions[idx].Completed) {
        const removable = this.invasions.splice(i, 1);
        if (currentInvasions[idx].Completed) { // delete messages if expired
          expired.push(remoavable);
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
      if (event.factions.length === 1) {
        rewardLine = `-${' '.repeat(width / 2 - event.factions[0].length / 2 - 2)}${event.factions[0]}-`;
      } else {
        rewardLine = `-${event.factions[0]}${' '.repeat(width - event.factions[0].length - event.factions[1].length - 2)}${event.factions[1]}-`;
      }
      let progressLine = `${"O".repeat(Math.abs(width - progress - 1))} ${"0".repeat(Math.abs(progress))}`;
      this.client.channels.get(this.invasions[i][0][0][0]).fetchMessage(this.invasions[i][0][0][1]).then((msg) => {
        msg.edit(`\`\`\`haskell
${content1}
${content2}
${rewardLine}
${progressLine}
\`\`\``
        );
      })
    }
    return expired;
  }
}

module.exports = InvasionBroadcaster;
