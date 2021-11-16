const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
// https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor

function embedMaker(){
	// inside a command, event listener, etc.
	const exampleEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Some title')
		.setURL('https://discord.js.org/')
		.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
		.setDescription('Some description here')
		.setThumbnail('https://i.imgur.com/AfFp7pu.png')
		.addFields(
			{ name: 'Regular field title', value: 'Some value here' },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Inline field title', value: 'Some value here', inline: true },
			{ name: 'Inline field title', value: 'Some value here', inline: true },
		)
		.addField('Inline field title', 'Some value here', true)
		.setImage('https://i.imgur.com/AfFp7pu.png')
		.setTimestamp()
		.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
	
	return { embeds: [exampleEmbed] };
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('run embed test')
		.addStringOption(option => option.setName('opt').setDescription('opt').setRequired(true)),
	async execute(interaction) {
		// const code = interaction.options.getString('code');
		return interaction.reply(`${embedMaker()}`).catch(console.error);
	},
};