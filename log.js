const fs = require('fs');

const stream = fs.createWriteStream("mobot.log", {flags:'a'});

module.exports = {
	log: s => stream.write(`${new Date().toISOString()} ${s}\n`)
}
// stream.end();