const { SlashCommandBuilder } = require('@discordjs/builders');
const { sum } = require('../common.js');

// CONVERT BETWEEN BASES

/** generate array of digits used as the alphabet for the base
 * @param {number} n */
function digits(n){
	if (36 < n || n < 1 || n !== Math.round(n))
		throw new RangeError();
	return '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, n);
}

/**
 * @param {string} n
 * @param {number} b base
 */
function toDecimal(n, b){
	const key = digits(b);
	const digArr = n.split('').map(
		(char, i) => key.indexOf(char) * b ** (n.length-i-1));
	return sum(digArr);
}

/**
 * @param {number} n
 * @param {number} b base
 * @returns {string}
 */
function fromDecimal(n, b){
	// todo
	const key = digits(b);
	const remainder = n % b;
	const quotient = Math.floor(n/b);
	if (0 < quotient)
		return fromDecimal(quotient, b) + key[remainder];
	return key[remainder];
}

/**
 * @param {string} n
 * @param {number} f
 * @param {number} t
 */
function base(n, f, t){
	return fromDecimal(toDecimal(n, f), t);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('base')
		.setDescription('convert between bases (supports 1-36)')
		.addStringOption(option => option.setName('n').setDescription('number to convert').setRequired(true))
		.addNumberOption(option => option.setName('from').setDescription('source base (default: base 10)'))
		.addNumberOption(option => option.setName('to').setDescription('target base (default: base 10)')),
	async execute(interaction){
		const n = interaction.options.getString('n').toLowerCase();
		const f = interaction.options.getNumber('from') || 10;
		const t = interaction.options.getNumber('to') || 10;
		return interaction.reply(`${base(n, f, t)}`).catch(console.error);
	},
};