const request = require("request");

let world_state = {};

module.exports = {
  getWs: ()=> {
    return world_state;
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
  }
}
