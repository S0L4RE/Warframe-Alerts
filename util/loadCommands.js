const fs = require("fs");

// load commands
function walk(commands, dir) {
  dir += "/";
  fs.readdir(dir, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      fs.stat(dir + file, (err, stats) => {
        if (stats && stats.isDirectory()) {
          walk(commands, dir + file)
        } else if (file.substr(-2) === "js") {
          let cmd = require("." + dir + file);
          commands.set(cmd.name, cmd);
          console.log(`[COMMAND LOAD] ${cmd.name}`);
        }
      })
    })
  })
}

// walk("./commands");
module.exports = (map, dir) => walk(map, dir.slice(0, -1));
