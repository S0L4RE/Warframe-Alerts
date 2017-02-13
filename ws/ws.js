const request = require("request");

let world_state = {};
let ps4_world_state = {};
let xb1_world_state = {};

module.exports = {
  getWs: ()=> {
    return world_state;
  },
  getPS4Ws: ()=> {
    return ps4_world_state;
  },
  getXB1Ws: ()=> {
    return xb1_world_state;
  },
  /**
   * update the WorldState information from the WorldState
   */
  updateWorldState: () => {
    request({uri: "http://content.warframe.com/dynamic/worldState.php"}, (err, response, body) => {
      if (err) return console.error(err);
      if (response.statusCode != 200) return console.error(response);
      world_state = JSON.parse(body);
      console.log(`Updated ws information.`);
    });
    // ps4 ws http://content.ps4.warframe.com/dynamic/worldState.php
    request({uri: "http://content.ps4.warframe.com/dynamic/worldState.php"}, (err, response, body) => {
      if (err) return console.error(err);
      if (response.statusCode != 200) return console.error(response);
      ps4_world_state = JSON.parse(body);
      console.log(`Updated ps4 ws information.`);
    });
    // xb1 ws http://content.xb1.warframe.com/dynamic/worldState.php
    request({uri: "http://content.xb1.warframe.com/dynamic/worldState.php"}, (err, response, body) => {
      if (err) return console.error(err);
      if (response.statusCode != 200) return console.error(response);
      xb1_world_state = JSON.parse(body);
      console.log(`Updated xb1 ws information.`);
    });
  }
}
