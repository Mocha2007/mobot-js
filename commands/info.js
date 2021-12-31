const { SlashCommandBuilder } = require('@discordjs/builders');

const infoString =
`mobot-js
a rewrite of Mobot by mocha2007
invite link:
https://discord.com/oauth2/authorize?client_id=909942496329621535&scope=bot&permissions=2048&redirect_uri=http%3A%2F%2Flocalhost%3A53134&scope=applications.commands`;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('bot info'),
	async execute(interaction){
		return interaction.reply(infoString);
	},
};