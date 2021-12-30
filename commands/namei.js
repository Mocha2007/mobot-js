const { SlashCommandBuilder } = require('@discordjs/builders');
const { Webpage } = require('../mochaWeb.js');
// const { random } = require('../common.js');

/**
 * @param {string} lang
 * @param {string} s search string
 * @returns {string}
*/
async function searchDict(lang, s){
	if (!searchDict.pages[lang])
		searchDict.pages[lang] = new Webpage(`https://mocha2007.github.io/namei/${lang}.txt`);
	const wp = searchDict.pages[lang];
	let lines;
	await wp.source().then(source => {
		lines = source.split('\n');
	});
	return lines.find(line => line.match(new RegExp(`.*${s}.*`, 'g')));
}
/** @type {{string: Webpage}} */
searchDict.pages = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('namei')
		.setDescription('look up a Nameian word')
		.addStringOption(option => option.setName('lang').setDescription('language to search').setRequired(true))
		.addStringOption(option => option.setName('s').setDescription('search string').setRequired(true)),
	async execute(interaction) {
		const lang = interaction.options.getString('lang');
		const s = interaction.options.getString('s');
		return interaction.reply(`${await searchDict(lang, s)}`).catch(console.error);
	},
};