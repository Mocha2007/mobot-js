const { SlashCommandBuilder } = require('@discordjs/builders');
const { random } = require('../common.js');

function dice(n, m){
	let s = 0;
	for (let i = 0; i < n; i++)
		s += random.randint(1, m);
	return s;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('roll nDm+b')
		.addNumberOption(option => option.setName('n').setDescription('number of dice').setRequired(true))
		.addNumberOption(option => option.setName('m').setDescription('sides on each die').setRequired(true))
		.addNumberOption(option => option.setName('b').setDescription('bonus')),
	async execute(interaction) {
		const n = interaction.options.getNumber('n');
		const m = interaction.options.getNumber('m');
		const b = interaction.options.getNumber('b') | 0;
		return interaction.reply(`${dice(n, m)+b}`).catch(console.error);
	},
};