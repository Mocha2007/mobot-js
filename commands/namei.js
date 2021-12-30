const { MessageEmbed } = require('discord.js');
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
searchDict.pages = {
	verdurian: new Webpage('https://zompist.com/ver2eng.txt'),
	nonMocha: ['verdurian'],
	nonMochaAuthorData: {
		verdurian: {
			name: 'Zompist',
			icon: 'https://zompist.com/vflag.gif',
			url: 'https://zompist.com/',
		}
	},
	setup(){
		// convert to Mocha format
		const ver = searchDict.pages.verdurian;
		ver.source().then(() => {
			ver.cache = ver.cache.replaceAll('\r', '\n').replaceAll(' - ', '=').replaceAll('\n\t', ';!');
		});
	},
};
searchDict.pages.setup();

/**
 * @param {string} lang
 * @param {string} s dict string
 */
async function embed(lang, s){
	const result = (await searchDict(lang, s)).slice(0, 1000);
	const def = result.split('=');
	const name = def[0];

	const exampleEmbed = new MessageEmbed()
		.setColor('#00ffff')
		.setTitle(name)
		.setTimestamp();
	def.forEach((x, i) => {
		exampleEmbed.addField(fieldNames[i] ? fieldNames[i] : 'note', x);
	});
	if (searchDict.pages.nonMochaAuthorData[lang])
		exampleEmbed.setAuthor(
			searchDict.pages.nonMochaAuthorData[lang].name,
			searchDict.pages.nonMochaAuthorData[lang].icon,
			searchDict.pages.nonMochaAuthorData[lang].url);
	else
		exampleEmbed.setURL(`https://mocha2007.github.io/namei/${lang}#lemma-${name}`)
			.setAuthor('Mocha', 'https://mocha2007.github.io/img/mo.png', 'https://mocha2007.github.io/');

	return { embeds: [exampleEmbed] };
}

const fieldNames = ['word', 'type', 'defs']

module.exports = {
	data: new SlashCommandBuilder()
		.setName('namei')
		.setDescription('look up a Nameian word')
		.addStringOption(option => option.setName('lang').setDescription('language to search').setRequired(true))
		.addStringOption(option => option.setName('s').setDescription('search string').setRequired(true)),
	async execute(interaction) {
		const lang = interaction.options.getString('lang');
		const s = interaction.options.getString('s');
		return interaction.reply(await embed(lang, s)).catch(console.error);
	},
};