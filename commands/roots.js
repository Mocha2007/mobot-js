const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');

const badRegex = /[a-z]\(/gim;

function rootsFromInteraction(interaction){
	let a, b, c, d, f, fraw, m, v, x0;
	switch (interaction.options.getSubcommand()){
		case 'linear':
			m = interaction.options.getNumber('m');
			b = interaction.options.getNumber('b');
			return -b/m;
		case 'quadratic':
			a = interaction.options.getNumber('a');
			b = interaction.options.getNumber('b');
			c = interaction.options.getNumber('c');
			v = -b/(2*a);
			d = Math.sqrt(b**2 - 4*a*c)/(2*a);
			return [v-d, v+d];
		default:
			fraw = interaction.options.getString('f');
			if (fraw.match(badRegex))
				throw new RangeError();
			f = eval('x=>' + fraw);
			x0 = interaction.options.getNumber('x0') | 1.12345; // can't be between 0 and 1 otherwise JS thinks 0 is truthy
			return parseFloat(newton(f, derivative(f), x0)); // just in case eval does something weird
	}
}

function derivative(f, delta = 1e-10){
	function dAtPoint(g, x){
		return (g(x + delta) - g(x))/delta;
	}
	return x => dAtPoint(f, x);
}

function newton(f, f_, x0){
	// console.debug(f, f_, x0)
	for (let i = 0; i < 10; i++)
		x0 -= f(x0) / f_(x0);
	return x0;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roots')
		.setDescription('return roots of a function')
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('linear')
				.setDescription('find the single root of a linear function')
				.addNumberOption(option => option.setName('m').setDescription('slope').setRequired(true))
				.addNumberOption(option => option.setName('b').setDescription('y-intercept').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('quadratic')
				.setDescription('find the two roots of a quadratic function')
				.addNumberOption(option => option.setName('a').setDescription('a').setRequired(true))
				.addNumberOption(option => option.setName('b').setDescription('b').setRequired(true))
				.addNumberOption(option => option.setName('c').setDescription('c').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('custom')
				.setDescription('newton\'s method')
				.addStringOption(option => option.setName('f').setDescription('function of x').setRequired(true))
				.addNumberOption(option => option.setName('x0').setDescription('initial x-value for algoithm'))
		),
	async execute(interaction){
		return interaction.reply(`${rootsFromInteraction(interaction)}`).catch(console.error);
	},
};