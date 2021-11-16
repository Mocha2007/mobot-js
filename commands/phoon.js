const { SlashCommandBuilder } = require('@discordjs/builders');
// const { round } = require('../common.js');

const names = [
	'New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
	'Full', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent'
]

const emoji = [
	'new_moon', 'crescent_moon', 'first_quarter_moon', 'full_moon',
	'full_moon', 'full_moon', 'last_quarter_moon', 'last_quarter_moon_with_face'
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('phoon')
		.setDescription('current lunar phase'),
	async execute(interaction) {
		const currenttime = Date.now()/1000;
		const fraction = ((currenttime-642900) % 2551442.9)/2551442.9;
		const moonphase = Math.round(8*fraction) % 8;
		const name = names[moonphase];
		const e = emoji[moonphase];
		return interaction.reply(`:${e}: ${name} (${Math.round(fraction*100)}%)`);
	},
};