const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Drawing } = require('../mochaImg.js');
const { random, range } = require('../common.js');
const { au, L_0, pi, r_sun, t_sun, universeAge, year } = require('../constants.js');

// static methods
/** @param {number} m */
function stargen(m, attempt = 0){
	if (9 < attempt && attempt % 10 === 0)
		console.warn(attempt + ' failed attempts');
	else if (100 < attempt)
		// too many failed attempts... something is broken :(
		return;
	const numberOfPlanets = random.randint(6, 12); // max observed = 8 (Sol)
	// (scaled) HD 10180b = 0.0216; Mercury = 0.3871
	// cf. https://en.wikipedia.org/wiki/List_of_multiplanetary_systems
	const c = random.uniform(0.1, 0.4);
	const startSMA = c*au*Math.pow(m, 2);
	const SMAList = [startSMA];
	range(numberOfPlanets).forEach(i => SMAList[i+1] = nextSMA(SMAList[i]));
	return SMAList.map(a => bodyGen(a, m));
}

/** @param {number} prev */
function nextSMA(prev){
	return prev * random.uniform(1.38, 2.01);
}

/**
 * @param {number} sma
 * @param {number} mass of star
*/
function bodyGen(sma, mass){
	/** @param {number} s */
	function generateBody(s, m){
		s /= au * Math.sqrt(m); // scale based on ~temp
		let mass;
		if (0.8 < s && s < 1.5)
			mass = Math.pow(10, random.uniform(23.8, 25.2));
		else if (5 < s && s < 31)
			mass = Math.pow(10, random.uniform(25.9, 28.3));
		else
			mass = 2*Math.pow(10, random.uniform(17, 27));
		const density = densityFromMass(mass);
		const radius = Math.pow(mass/(density*4/3*pi), 1/3);
		const albedo = random.uniform(0.1, 0.7);
		return {mass: mass, radius: radius, albedo: albedo};
	}
	/** @param {number} s */
	function generateOrbit(s, mass){
		// http://exoplanets.org/plots
		// https://www.desmos.com/calculator/ixd7gm2hpy
		const ecc = random.uniform(0, 0.21); // Math.pow(Game.rng.random(), 2.2)
		const inc = random.uniform(0, 0.13);
		const aop = random.uniform(0, 2*pi);
		const lan = random.uniform(0, 2*pi);
		const man = random.uniform(0, 2*pi);
		return {sma: s, ecc: ecc, inc: inc, aop: aop, lan: lan, man: man};
	}
	const planet = generateBody(sma, mass);
	planet.orbit = generateOrbit(sma, mass);
	// planet.name = 'Sol-' + random.randint(100000, 999999);
	// planet.atmosphere = Atmosphere.gen(planet);
	return planet;
}

/** @param {number} mass */
function densityFromMass(mass){
	if (2e26 < mass)
		return random.uniform(600, 1400);
	if (6e25 < mass)
		return random.uniform(1200, 1700);
	return random.uniform(3900, 5600);
}

/** @param {number} mass */
function star(mass){
	const s = {mass: mass};
	s.lifespan = 3e17*Math.pow(mass, -2.5162);
	s.age = random.uniform(15.5e6*year, Math.min(universeAge, s.lifespan));
	const baseLum = 0.45 < mass ? 1.148*Math.pow(mass, 3.4751) : 0.2264*Math.pow(mass, 2.52);
	s.luminosity = luminosity(baseLum, s.age, s.lifespan);
	s.absMag = -2.5 * Math.log10(s.luminosity / L_0);
	s.radius = r_sun*Math.pow(mass, 0.96);
	s.temp = t_sun*Math.pow(mass, 0.54);
	return s;
}

/** @param {number} age */
function luminosity(baseLum, age, lifespan){
	const f = age / lifespan;
	let l = 1;
	if (f < 0.6)
		l = 0.693 * Math.exp(0.991*f);
	else if (f < 0.9)
		l = 0.42 * Math.exp(1.78*f);
	else if (f < 0.93)
		l = 1.01 * Math.exp(0.814*f);
	else if (f < 0.97)
		l = 3.62e-9 * Math.exp(21.7*f);
	else if (f < 1)
		l = 7.08e-39 * Math.exp(91.9*f);
	else { // white dwarf
		const x = (age - lifespan)/(1e6*year); // time since death, Myr
		l = 4.9 * Math.pow(x, -1.32);
	}
	return baseLum * l;
}

/** @param {number} mass */
function embed(mass){
	const result = stargen(mass);
	draw(result);
	const exampleEmbed = new MessageEmbed()
		.setColor('#00ffff')
		// .setTitle(name)
		.setAuthor('Mocha', 'https://mocha2007.github.io/img/mo.png', 'https://mocha2007.github.io/')
		.setImage('attachment://temp/temp.png')
		.addField('Star', JSON.stringify(star(mass)))
		.setTimestamp();
	/*
	result.forEach((x, i) => {
		exampleEmbed.addField(fieldNames[i] ? fieldNames[i] : 'note', x);
	});
	*/
	result.forEach((planet, i) => {
		exampleEmbed.addField(`Planet ${i}`, JSON.stringify(planet));
		//for (const field in planet)
		//	exampleEmbed.addField(fieldNames[i] ? fieldNames[i] : 'note', x);
	});
	return { embeds: [exampleEmbed] };
}

/** @param {Array} planetArr */
function draw(planetArr, detail = 40){
	const drawing = new Drawing();
	const scale = drawing.size / (planetArr[planetArr.length-1].orbit.sma * 2); // px/m
	// draw orbits
	planetArr.forEach(planet => {
		/** @type {number} */
		const sma = planet.orbit.sma;
		drawing.drawPath(range(detail+1).map(i => {
			const [x, y] = [drawing.size/2, drawing.size/2];
			const r = sma * scale;
			const theta = 2*pi/detail * i;
			return [x+r*Math.cos(theta), y+r*Math.sin(theta)];
		}));
	});
	drawing.save();
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stargen')
		.setDescription('create a star system')
		.addNumberOption(option => option.setName('m').setDescription('mass of the star, in solar masses')),
	async execute(interaction) {
		const m = interaction.options.getNumber('m') || 1;
		return interaction.reply(embed(m)).catch(console.error);
	},
};