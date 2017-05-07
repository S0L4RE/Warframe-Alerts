const decks = require("../../datamine/mission_decks.json");

module.exports = {
  name: "rewards",
  desc: "search mission/relic rewards",
  example: "rewards venom, rewards nova prime systems",
  run: (bot, message, args) => {
    const searchTerm = args.join(" ").toLowerCase();
    const rewards = [];
    for (obj in decks) {
      for (key in decks[obj]) {
        if (key === "Locations") continue;
        if (decks[obj][key].some(a => a.toLowerCase().includes(searchTerm))) {
          rewards.push(...decks[obj].Locations.map(l => l.split(",").slice(0, 2).join(",")));
        }
      }
    }
    message.channel.send(["```haskell",
      `Drops that include the term ${searchTerm.toUpperCase()} can be found at:`,
      rewards.join("\n"),
      "Try ',search mission " + rewards[0] + "' for drop more info```"
    ])
  }
}
