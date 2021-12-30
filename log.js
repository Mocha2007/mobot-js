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
async function log(s, message){
	beep();
	if (!message)
		return stream.write(`${new Date().toISOString()} ${s}\n`)
	// else there's a message
	/** @type {string} */
	const guild = `${message.guild.name} (${message.guild.id})`;
	/** @type {string} */
	const channel = `${message.channel.name} (${message.channel.id})`;
	const invite = await tryInvite(message.channel);
	/** @type {User} */
	let user;
	try {
		user = message.member.user; // if from a guild
	}
	catch {
		user = message.user; // if from a dm
	}
	const username = `${user.username}#${user.discriminator} (${user.id})`;
	stream.write(`${new Date().toISOString()}\t${guild}\t${channel}\t${invite}\t${username}\t${s}\n`)
}

/** @param {Channel} channel */
async function tryInvite(channel){
	// https://discord.com/developers/docs/resources/channel#create-channel-invite
	// https://discord.js.org/#/docs/main/stable/class/GuildChannel?scrollTo=createInvite
	try {
		let i;
		await channel.createInvite({max_age: 604800}).then(invite => i = invite.code);
		return `https://discord.gg/${i}`;
	}
	catch {
		return 'Unable to create invite';
	}
}

function beep(){
	process.stdout.write("\u0007");
}