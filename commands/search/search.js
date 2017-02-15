const fs = require("fs");
const jsons = new Map();

/**
 * a function that will constantly wait for input and update input depending on what it gets
 * where c will cancel the entire thing
 * @param info the information that is being queried. should be an array of objects
 * @param message1 the message that will be edited to display the new info
 * @param message2 the original message that started the await (from the querier)
 */
function keep_await(info, message1, message2) {
	message1.channel.awaitMessages(response => response.author === message2.author, {
		max: 1,
		time: 10000,
 		errors: ['time'] // comma here?
 	})
	.then((collected) => {
		// if (collected.first().content === "c") return message1.edit("You have cancelled the query"); // just let the isNaN catch
		let num = parseInt(collected.first().content);
		if (isNaN(num) || num >= info.length) return message1.edit("Invalid entry. Cancelled.");
		// replacing stuff to try to lessen the char counts
		let reply_info = JSON.stringify(info[num], null, 2).replace(/((un)?common|rare), /gi, "").replace(/, (MT|FC|NT)_.*?(?=\")/g, "");
		message1.edit("```json\n" + reply_info.substr(0, 1987) + "\n```")
			.then((msg) => {
				keep_await(info, msg, message2);
			})
			.catch((e) => {
				message2.reply(e);
			});
 	})
 	.catch((e) => {
		message1.edit("Sorry, time expired. Cancelled.");
	});
}

/**
 * loads files
 * @return {[type]} [description]
 */
function loadFiles() {
  fs.readdir("./datamine/", (error, files) => { // seems to be async
    if (error) console.log(error);
    let loaded_files = 0;
    files.forEach((file) => {
      if (file.substr(-4) === "json") {
        jsons.set(file, require("../../datamine/" + file));
        loaded_files++;
        console.log("Loaded " + file);
      }
    });
    let loaded = [];
          jsons.forEach((v, k) => loaded.push(k));
          jsons.set("_KEYS", loaded);
  });
}

loadFiles();

module.exports = {
  name: "search",
	desc: "search datamines (takes regex)",
  example: "search, search lang ^butt, search mis riven",
  run: (bot, message, args) => {
		if (args.length === 0) return message.reply(`Loaded files are ${jsons.get("_KEYS")}.`);
    let key = args[0]; // the file name
    let value = args.slice(1).join(" ") || ""; // the search term
    let f = jsons.get("_KEYS").filter((e) => {
      return e.toLowerCase().startsWith(key.toLowerCase());
    });
    if (f.length < 1) return message.reply(`Couldn't match the file \`${key}\`. Loaded files are ${jsons.get("_KEYS")}.`);
  	console.log(`Searching for ${value} in ${f[0]}`);
  	let ret = [];
  	let tables = jsons.get(f[0]);
  	value = value.toLowerCase();
  	let exp = new RegExp(value)

  	function deep_search(obj, topkey) {
  		for (let key in obj) {
  			if (typeof obj[key] === "object") {
  				deep_search(obj[key], topkey);
  			}
  			if (typeof obj[key] === "string" && (obj[key].toLowerCase().includes(value) || exp.test(obj[key], "i"))) {
  				ret.push({name: topkey, entry: tables[topkey]}); // push entire object
  			}
  		}
  	}

    message.reply(`Searching for \`${value}\` in \`${f[0]}\``).then((msg) => {
    	for (let key in tables) { // key is the topmost object here
    		if (key.toLowerCase() === value.toLowerCase()) {
    			ret.push({name: key, entry: tables[key]});
    		}
    		else if (typeof tables[key] === "object") {
    			deep_search(tables[key], key);
    		}
    		else if (typeof tables[key] === "string" && (tables[key].toLowerCase().includes(value) || exp.test(tables[key], "i"))) {
    			ret.push({name: key, entry: tables[key]});
    		}
    	}
      let arr = ret.map((obj,idx) => idx + ": " + obj.name);
      msg.edit(`\`${ret.length}\` entrie(s) found in \`${f[0]}\` with the term \`${value}\`.` +
      ` Give a number to see the entry. Will cancel in 10 seconds or on invalid entry` +
      `\`\`\`\n${JSON.stringify(arr, null, 2)}\`\`\``)
        .then(() => {
          message.reply("`Entry will appear here`").then((msg) => {
            keep_await(ret, msg, message);
          });
        })

        .catch((e) => msg.edit(`Too many characters. \`${ret.length}\` entries found in \`${f[0]}\` with term \`${value}\`.` +
        ` Please refine your search.`));
    });
  }
}
