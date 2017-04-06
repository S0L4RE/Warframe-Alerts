const RSSEvent = require("./RSSEvent");
// const ws = require("../ws/ws");

class InvasionEvent extends RSSEvent{
  constructor(guid, author, title, pubDate, type) {
    super(guid, author, title.replace("PHORID SPAWN ", ""), pubDate);
    title = title.split(" - ");
    this.location = title[title.length - 1];
    title = title[0].split(" VS. ");
    this.factions = [];
    for (let idx = 0; idx < title.length; idx++) {
      this.factions.push(title[idx]);
    }
    this.platform_type = type; // type will be PS4, XB1, or PC
  }

  toString() {
    return `\`\`\`haskell
inv [Invasion]
${this.location}
${this.factions.join("\n")}
\`\`\``
  }
}

module.exports = InvasionEvent;
