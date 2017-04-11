const superagent = require("superagent");

let worldState = {};
let ps4WorldState = {};
let xb1WorldState = {};

module.exports = {
  getWs: {
    pc: () => worldState,
    ps4: () => ps4WorldState,
    xb1: () => xb1WorldState
  },
  /**
   * update the WorldState information from the WorldState
   */
  update: () => {
    superagent.get("http://content.warframe.com/dynamic/worldState.php").end((err, content) => {
      if (err) return console.error(err);
      worldState = JSON.parse(content.text);
    })
    // ps4 ws http://content.ps4.warframe.com/dynamic/worldState.php
    superagent.get("http://content.ps4.warframe.com/dynamic/worldState.php").end((err, content) => {
      if (err) return console.error(err);
      ps4WorldState = JSON.parse(content.text);
    })
    // xb1 ws http://content.xb1.warframe.com/dynamic/worldState.php
    superagent.get("http://content.xb1.warframe.com/dynamic/worldState.php").end((err, content) => {
      if (err) return console.error(err);
      xb1WorldState = JSON.parse(content.text);
    })
  }
}
