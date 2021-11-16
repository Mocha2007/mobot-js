const { SlashCommandBuilder } = require('@discordjs/builders');
const { romanNumeral } = require('../common.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('romannumeral')
		.setDescription('convert from arabic to roman numerals')
		.addNumberOption(option => option.setName('n').setDescription('number').setRequired(true)),
	async execute(interaction) {
		const n = interaction.options.getNumber('n');
		return interaction.reply(`${romanNumeral(n)}`).catch(console.error);
	},
};