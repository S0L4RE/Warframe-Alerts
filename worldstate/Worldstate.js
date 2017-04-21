const superagent = require("superagent");

let worldState = {};
let ps4WorldState = {};
let xb1WorldState = {};

function enhanceWS(ws) {
  expireReadableTimes(ws, ws.Time * 1000);
  return ws;
}

function expireReadableTimes(obj, wstime) {
  if (obj["$date"] && obj["$date"]["$numberLong"]) {
    const difference = (obj["$date"]["$numberLong"] - wstime) / 1000;
    obj["$date"]["$readable"] = (new Date(parseInt(obj["$date"]["$numberLong"]))).toUTCString();
    const absDif = Math.abs(difference);
    if (difference > 0) {
      obj["$timeTil"] = {
        $numberLong: absDif,
        $readable: `${absDif / 3600 << 0}h ${absDif % 3600 / 60 << 0}m ${absDif % 60 << 0}s`
      }
    } else {
      obj["$timeAgo"] = {
        numberLong: absDif,
        $readable: `${absDif / 3600 << 0}h ${absDif % 3600 / 60 << 0}m ${absDif % 60 << 0}s`
      }
    }
  } else {
    for (key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === "object") {
        expireReadableTimes(obj[key], wstime);
      }
    }
  }
}

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
    return new Promise((resolve) => {
      let a = new Promise((resolve) => {
        superagent.get("http://content.warframe.com/dynamic/worldState.php").end((err, content) => {
          if (err) return console.log(error.status || error.response);
          worldState = enhanceWS(JSON.parse(content.text));
          resolve("Done PC");
        })
      })
      // ps4 ws http://content.ps4.warframe.com/dynamic/worldState.php
      let b = new Promise((resolve) => {
        superagent.get("http://content.ps4.warframe.com/dynamic/worldState.php").end((err, content) => {
          if (err) return console.log(error.status || error.response);
          ps4WorldState = enhanceWS(JSON.parse(content.text));
          resolve("Done PS4");
        })
      })
      // xb1 ws http://content.xb1.warframe.com/dynamic/worldState.php
      let c = new Promise((resolve) => {
        superagent.get("http://content.xb1.warframe.com/dynamic/worldState.php").end((err, content) => {
          if (err) return console.log(error.status || error.response);
          xb1WorldState = enhanceWS(JSON.parse(content.text));
          resolve("Done XB1");
        })
      })
      Promise.all([a, b, c]).then(() => {
        resolve("Done");
      })
    })
  }
}
