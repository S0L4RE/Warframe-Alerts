const superagent = require("superagent");
const fs = require("fs");
const file = "./datamine/drop_rates.json";
let drop_rates = {};

module.exports = {
  update: () => {
    return new Promise((resolve) => {
      if (fs.existsSync(file))
        fs.createReadStream(file).pipe(fs.createWriteStream(file + ".bak"));

      superagent.get("https://raw.githubusercontent.com/VoiDGlitch/WarframeData/master/DropTables.txt").end((err, content) => {
        if (err) return console.log(error.status || error.response);
        content.text.split(/.*(?=\[.*?\])/g).forEach((entry) => {
          let table_name = entry.match(/(?!\[).*?(?=\])/);
          let enemy_names;
          drop_rates[table_name] = {};
          try {
            enemy_names = entry.match(/-.*? \(.*?\)/g).map((name) => name.slice(2))
          }
          catch(e) { /*there are no names for this drop table*/ }
          drop_rates[table_name].names = enemy_names ? enemy_names : [];
          let drop_types = entry.match(/DROP.*?(?=\n)/g);
          if (drop_types) {
            let drop_items = entry.split(/DROP.*?\n/g);
            let i = 1; // start from after the first DROP_
            drop_types.forEach((type) => {
              drop_rates[table_name][type] = drop_items[i].split("\n").filter((entry) => entry !== "").map((item) => item.replace("\t", "")).map((item) => {
                let deets = item.split(", ");
                /*
                return {item: deets[0],
                  // rarity: deets[1],
                  chance: deets[2],
                  bias: deets[3] ? deets[3].slice(5) : null};
                  replace with string way for consistency
                */
                return `${deets[0]}, ${deets[2]}, ${deets[3] ? deets[3].slice(5) : null}`;
              });
              i++;
            })
          }
        })
        fs.writeFile(file, JSON.stringify(drop_rates), (err) => {
          if (err) resolve([file, false]);
          else resolve([file, true]);
        });
      })
    })
  }
}
