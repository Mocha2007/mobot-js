const { SlashCommandBuilder } = require('@discordjs/builders');

// SOLVE TRIANGLES

function triangleSolve(data){
	/** @type {number} */
	const s1 = data.s1;
	/** @type {number} */
	let s2 = data.s2;
	/** @type {number} */
	let s3 = data.s3;
	/** @type {number} */
	let a1 = data.a1;
	/** @type {number} */
	let a2 = data.a2;
	/** @type {number} */
	let a3 = data.a3;
	// do law of cosines at first, if possible...
	// SSS - one relevant case
	if (s1 && s2 && s3)
		a1 = Math.acos((s2**2 + s3**2 - s1**2)/(2*s2*s3))
	// SSA - two relevant cases
	if (s1 && s2 && a3)
		s3 = Math.sqrt(s1**2 + s2**2 - 2*s1*s2*Math.cos(a3))
	if (s1 && s3 && a2)
		s2 = Math.sqrt(s1**2 + s3**2 - 2*s1*s3*Math.cos(a2))
	// see what we got...
	// figure the third angle out...
	// do we got a1, a2?
	if (a1 && a2)
		a3 = 180 - a1 - a2;
	// do we got a1, a3?
	if (a1 && a3)
		a2 = 180 - a1 - a3;
	// do we got a2, a3?
	if (a2 && a3)
		a1 = 180 - a2 - a3;
	// use law of sines to find remaining sides/angles
	// we KNOW we got side 1... let's try to get a2 and s2
	if (a1 && s2)
		a2 = Math.asin(s2/s1 * Math.sin(a1));
	if (a1 && a2)
		s2 = (Math.sin(a2)/Math.sin(a1)) * s1;
	// we KNOW we got side 1... let's try to get a3 and s3
	if (a1 && s3)
		a3 = Math.asin(s3/s1 * Math.sin(a1));
	if (a1 && a3)
		s3 = (Math.sin(a3)/Math.sin(a1)) * s1;
	// try to use s2 to get s1
	if (s2 && a2 && s1)
		a1 = Math.asin(s1/s2 * Math.sin(a2));
	if (a2 && a2 && a1)
		s1 = (Math.sin(a1)/Math.sin(a2)) * s2;
	// try to use s2 to get s3
	if (s2 && a2 && s3)
		a3 = Math.asin(s3/s2 * Math.sin(a2));
	if (a2 && a2 && a3)
		s3 = (Math.sin(a3)/Math.sin(a2)) * s2;
	// try to use s3 to get s1
	if (s3 && a3 && s1)
		a1 = Math.asin(s1/s3 * Math.sin(a3));
	if (a3 && a3 && a1)
		s1 = (Math.sin(a1)/Math.sin(a3)) * s3;
	// try to use s3 to get s2
	if (s3 && a3 && s2)
		a2 = Math.asin(s2/s3 * Math.sin(a3));
	if (a3 && a3 && a1)
		s2 = (Math.sin(a2)/Math.sin(a3)) * s3;
	// might need law of cosines...lol
	return {s1: s1, s2: s2, s3: s3, a1: a1, a2: a2, a3: a3};
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('base')
		.setDescription('convert between bases (supports 1-36)')
		.addNumberOption(option => option.setName('s1').setDescription('side A').setRequired(true))
		.addNumberOption(option => option.setName('s2').setDescription('side B'))
		.addNumberOption(option => option.setName('s3').setDescription('side C'))
		.addNumberOption(option => option.setName('a1').setDescription('angle alpha'))
		.addNumberOption(option => option.setName('a2').setDescription('angle beta'))
		.addNumberOption(option => option.setName('a3').setDescription('angle gamma')),
	async execute(interaction) {
		const s1 = interaction.options.getNumber('s1');
		const s2 = interaction.options.getNumber('s2');
		const s3 = interaction.options.getNumber('s3');
		const a1 = interaction.options.getNumber('a1');
		const a2 = interaction.options.getNumber('a2');
		const a3 = interaction.options.getNumber('a3');
		
		return interaction.reply(`${triangleSolve(
			{s1: s1, s2: s2, s3: s3, a1: a1, a2: a2, a3: a3}
		)}`).catch(console.error);
	},
};