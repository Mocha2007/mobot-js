const fs = require('fs');

const stream = fs.createWriteStream("mobot.log", {flags:'a'});

module.exports = {
	log: log,
};
// stream.end();

/** 
 * @param {string} s any text you want
 * @param {CommandInteraction<CacheType>} message the exact message (optional)
*/
function log(s, message){
	if (!message)
		return stream.write(`${new Date().toISOString()} ${s}\n`)
	// else there's a message
	/** @type {number} */
	const guildId = message.guild.id;
	/** @type {number} */
	const channelId = message.channel.id;
	/** @type {User} */
	let user;
	try {
		user = message.member.user; // if from a guild
	}
	catch {
		user = message.user; // if from a dm
	}
	const username = `${user.username}#${user.discriminator} (${user.id})`;
	stream.write(`${new Date().toISOString()}\t${guildId}\t${channelId}\t${username}\t${s}\n`)
}