const request = require("request");
const fs = require("fs");
const file = "./datamine/languages.json";

if (fs.existsSync(file))
  fs.createReadStream(file).pipe(fs.createWriteStream(file + ".bak"));

request({
	uri: "https://raw.githubusercontent.com/VoiDGlitch/WarframeData/master/JSON/Languages.json",
}, function(error, response, body) {
	if (error) {
    console.log("Err: " + error);
    process.exit(0);
  }
	fs.writeFile(file, JSON.stringify(JSON.parse(body), null, 2), (err) => {
		if (err) console.log("error");
		else console.log("good");
	});
});
