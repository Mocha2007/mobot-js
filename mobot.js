const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { mochaId, token } = require('./config.json');
const { log } = require('./log.js');
const { restart } = require('./common.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('mobot-js loaded!');
	client.user.setActivity(`mocha2007.github.io`, { type: "LISTENING" });
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	console.log(`Running ${interaction.commandName}`);

	try {
		await command.execute(interaction);
		log(interaction.commandName, interaction);
	}
	
	catch (error){
		console.error(error);
		log(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

	// restart bot
	if (interaction.commandName == 'ping' && interaction.user.id === mochaId)
		restart(interaction);
});

client.login(token);