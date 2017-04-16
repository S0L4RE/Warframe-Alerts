const superagent = require("superagent");
const fs = require("fs");
const file = "./datamine/mission_decks.json";

module.exports = {
  update: () => {
    return new Promise((resolve) => {
      if (fs.existsSync(file))
        fs.createReadStream(file).pipe(fs.createWriteStream(file + ".bak"));

      superagent.get("https://raw.githubusercontent.com/VoiDGlitch/WarframeData/master/JSON/MissionDecks.json").end((err, content) => {
        if (err) return console.log(error.status || error.response);
        fs.writeFile(file, JSON.stringify(JSON.parse(content.text)), (err) => {
          if (err) resolve([file, false]);
          else resolve([file, true]);
        })
      })
    })
  }
}
