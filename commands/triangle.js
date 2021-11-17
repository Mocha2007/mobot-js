const { MessageEmbed } = require('discord.js');
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
	const out = () => {
		return {s1: s1, s2: s2, s3: s3, a1: a1, a2: a2, a3: a3};
	}
	// do law of cosines at first, if possible...
	// SSS - one relevant case
	if (s2 && s3){
		a1 = Math.acos((s2**2 + s3**2 - s1**2)/(2*s2*s3))
		a2 = Math.acos((s1**2 + s3**2 - s2**2)/(2*s1*s3))
		a3 = Math.acos((s2**2 + s1**2 - s3**2)/(2*s2*s1))
		return out();
	}
	// SAS - two relevant cases
	if (s2 && a3){
		s3 = Math.sqrt(s1**2 + s2**2 - 2*s1*s2*Math.cos(a3))
		return triangleSolve(out());
	}
	if (s3 && a2){
		s2 = Math.sqrt(s1**2 + s3**2 - 2*s1*s3*Math.cos(a2))
		return triangleSolve(out());
	}
	// after this point, we must have one of:
	// SSA or AAS or ASA
	// check for SSA
	if (a1 && s2){
		a2 = Math.asin(s2/s1 * Math.sin(a1));
		a3 = 180 - a1 - a2;
		// now we can use SAS above...
		return triangleSolve(out());
	}
	if (s2 && a2){
		a1 = Math.asin(s1/s2 * Math.sin(a2));
		a3 = 180 - a1 - a2;
		// now we can use SAS above...
		return triangleSolve(out());
	}
	// after this point, we must have one of:
	// AAS or ASA
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
	// at this point we have one side (s1)
	// and ALL three angles.
	// use law of sines to find remaining sides
	s2 = (Math.sin(a2)/Math.sin(a1)) * s1;
	s3 = (Math.sin(a3)/Math.sin(a1)) * s1;
	return out();
}

function area(a, b, c){
	const s = (a + b + c)/2;
	return Math.sqrt(s * (s-a) * (s-b) * (s-c));
}

function triangleEmbed(triangle){
	triangle.a1d = Math.round(triangle.a1 * 180/Math.PI);
	triangle.a2d = Math.round(triangle.a2 * 180/Math.PI);
	triangle.a3d = Math.round(triangle.a3 * 180/Math.PI);
	const maxa = Math.max(triangle.a1d, triangle.a2d, triangle.a3d);
	const type = Math.PI < maxa ? 'Obtuse' : maxa === 90 ? 'Right' : 'Acute';
	const embed = new MessageEmbed()
		.setColor('#00ffff')
		.setTitle('Triangle')
		.setDescription(type)
		// .setThumbnail('https://i.imgur.com/AfFp7pu.png')
		.addFields(
			{ name: 'Side A', value: `${triangle.s1}`, inline: true },
			{ name: 'Side B', value: `${triangle.s2}`, inline: true },
			{ name: 'Side C', value: `${triangle.s3}`, inline: true },
			{ name: 'Angle α', value: `${triangle.a1} rad (${triangle.a1d}°)`, inline: true },
			{ name: 'Angle β', value: `${triangle.a2} rad (${triangle.a2d}°)`, inline: true },
			{ name: 'Angle γ', value: `${triangle.a3} rad (${triangle.a3d}°)`, inline: true },
			{ name: 'Area', value: `${area(triangle.s1, triangle.s2, triangle.s3)}`},
			{ name: 'Perimeter', value: `${triangle.s1 + triangle.s2 + triangle.s3}`},
		)
		.setTimestamp();
	return { embeds: [embed] };
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('triangle')
		.setDescription('solve a triangle using a side and two other parameters')
		.addNumberOption(option => option.setName('s1').setDescription('side A').setRequired(true))
		.addNumberOption(option => option.setName('s2').setDescription('side B'))
		.addNumberOption(option => option.setName('s3').setDescription('side C'))
		.addNumberOption(option => option.setName('a1').setDescription('angle alpha (rad)'))
		.addNumberOption(option => option.setName('a2').setDescription('angle beta (rad)'))
		.addNumberOption(option => option.setName('a3').setDescription('angle gamma (rad)')),
	async execute(interaction) {
		const s1 = interaction.options.getNumber('s1');
		const s2 = interaction.options.getNumber('s2');
		const s3 = interaction.options.getNumber('s3');
		const a1 = interaction.options.getNumber('a1');
		const a2 = interaction.options.getNumber('a2');
		const a3 = interaction.options.getNumber('a3');
		
		return interaction.reply(
			triangleEmbed(triangleSolve({s1: s1, s2: s2, s3: s3, a1: a1, a2: a2, a3: a3}))
		).catch(console.error);
	},
};