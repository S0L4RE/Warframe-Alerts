const request = require("request");
const fs = require("fs");
const file = "./datamine/star_chart.json";
let star_chart = {};

if (fs.existsSync(file))
  fs.createReadStream(file).pipe(fs.createWriteStream(file + ".bak"));

request({
	uri: "https://raw.githubusercontent.com/VoiDGlitch/WarframeData/master/StarChart.txt",
}, function(error, response, body) {
  if (error) {
    console.log("Err: " + error);
    process.exit(0);
  }
	var info = body.split(/.*(?=\[.*?\])/g);
	// console.log(info[0]);
	for(let idx = 0; idx < info.length; idx++) {
		let planet = info[idx].match(/\[.*?\]/g);
        	let entries = info[idx].split(/(\[.*?\])?\n\n\s*/g); // split by 2 lines and as much whitespace as possible
	        for (let idx2 = 0; idx2 < entries.length; idx2+=2) {
			// console.log(planet[0]);
			let name = entries[idx2].match(/Name: .*/g); // might accidentally be null
			if (name == null) continue;
			let faction = cleanUp(entries[idx2].match(/Faction: .*/g)[0]);
			let mt = cleanUp(entries[idx2].match(/MissionType: .*/g)[0]);
			let nt = cleanUp(entries[idx2].match(/NodeType: .*/g)[0]);
			let aw = cleanUp(entries[idx2].match(/ArchwingRequired: .*/g)[0]) === "Yes";
			let sw = cleanUp(entries[idx2].match(/IsSharkwing: .*/g)[0]) === "Yes";
			let node_id = cleanUp(entries[idx2].match(/Id: .*/g)[0]);
			name = cleanUp(name[0]);
			// console.log(name + node_id);
			star_chart[node_id] = {
					name: name + " " + planet,
					faction: faction,
					mission_type: mt,
					node_type: nt,
					archwing: aw,
					sharkwing: sw
      }
  	}
	}
	// finished for now

	fs.writeFile(file, JSON.stringify(star_chart, null, 2), (err) => {
		if (err) console.log("error");
		else console.log("good");
	});
});

function cleanUp(string) {
	let ret = string.split(": ");
	return ret[1];
}
