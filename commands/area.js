const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');

function areaFromInteraction(interaction){
	let a, b, c, h, l, r, s;
	switch(interaction.options.getSubcommand()){
		case 'circle':
			r = interaction.options.getNumber('r');
			return Math.PI * r * r;
		case 'cone':
			l = interaction.options.getNumber('l');
			r = interaction.options.getNumber('r');
			return Math.PI * r * (r + l);
		case 'cube':
			s = interaction.options.getNumber('s');
			return 6 * s * s;
		case 'cylinder':
			h = interaction.options.getNumber('h');
			r = interaction.options.getNumber('r');
			return 2 * Math.PI * r * (r + h);
		case 'hemisphere':
			r = interaction.options.getNumber('r');
			return 3 * Math.PI * r * r;
		case 'rectangle':
			a = interaction.options.getNumber('a');
			b = interaction.options.getNumber('b');
			return a * b;
		case 'rectangular_prism':
			l = interaction.options.getNumber('l');
			w = interaction.options.getNumber('w');
			h = interaction.options.getNumber('h');
			return 2*(l*w + w*h + h*l);
		case 'sphere':
			r = interaction.options.getNumber('r');
			return 4 * Math.PI * r * r;
		case 'square':
			s = interaction.options.getNumber('s');
			return s * s;
		case 'trapezoid':
			a = interaction.options.getNumber('a');
			b = interaction.options.getNumber('b');
			h = interaction.options.getNumber('h');
			return (a + b)/2 * h;
		case 'triangle_bh':
			b = interaction.options.getNumber('b');
			h = interaction.options.getNumber('h');
			return (h + b)/2;
		case 'triangle_sides':
			a = interaction.options.getNumber('a');
			b = interaction.options.getNumber('b');
			c = interaction.options.getNumber('c');
			s = (a+b+c)/2;
			return Math.sqrt(s*(s-a)*(s-b)*(s-c));
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('area')
		.setDescription('return area of a shape')
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('circle')
				.setDescription('return area of a circle')
				.addNumberOption(option => option.setName('r').setDescription('radius').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('cone')
				.setDescription('return surface area of a cone')
				.addNumberOption(option => option.setName('l').setDescription('slant height').setRequired(true))
				.addNumberOption(option => option.setName('r').setDescription('radius').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('cube')
				.setDescription('return surface area of a cube')
				.addNumberOption(option => option.setName('s').setDescription('side length').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('cylinder')
				.setDescription('return surface area of a cylinder')
				.addNumberOption(option => option.setName('h').setDescription('height').setRequired(true))
				.addNumberOption(option => option.setName('r').setDescription('radius').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('hemisphere')
				.setDescription('return surface area of a hemisphere')
				.addNumberOption(option => option.setName('r').setDescription('radius').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('rectangle')
				.setDescription('return area of a rectangle')
				.addNumberOption(option => option.setName('h').setDescription('height').setRequired(true))
				.addNumberOption(option => option.setName('w').setDescription('width').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('rectangular_prism')
				.setDescription('return surface area of a rectangular prism')
				.addNumberOption(option => option.setName('h').setDescription('height').setRequired(true))
				.addNumberOption(option => option.setName('l').setDescription('length').setRequired(true))
				.addNumberOption(option => option.setName('w').setDescription('width').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('sphere')
				.setDescription('return surface area of a sphere')
				.addNumberOption(option => option.setName('r').setDescription('radius').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('square')
				.setDescription('return area of a square')
				.addNumberOption(option => option.setName('s').setDescription('side length').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('trapezoid')
				.setDescription('return area of a trapezoid')
				.addNumberOption(option => option.setName('a').setDescription('base').setRequired(true))
				.addNumberOption(option => option.setName('b').setDescription('base').setRequired(true))
				.addNumberOption(option => option.setName('h').setDescription('height').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('triangle_bh')
				.setDescription('return area of a triangle from its base and height')
				.addNumberOption(option => option.setName('b').setDescription('base').setRequired(true))
				.addNumberOption(option => option.setName('h').setDescription('height').setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('triangle_sides')
				.setDescription('return area of a triangle from its three sides')
				.addNumberOption(option => option.setName('a').setDescription('side').setRequired(true))
				.addNumberOption(option => option.setName('b').setDescription('side').setRequired(true))
				.addNumberOption(option => option.setName('c').setDescription('side').setRequired(true))
		),
	async execute(interaction) {
		return interaction.reply(`${areaFromInteraction(interaction)}`).catch(console.error);
	},
};