const { SlashCommandBuilder } = require('@discordjs/builders');
const { romanNumeral } = require('../common.js');

const days = [ // diēs + ? s gen
	'sōlis', // Sunday
	'lūnae',
	'mārtis',
	'mercuriī',
	'iovis',
	'veneris',
	'saturnī',
];
const monthsAbl = [ // f pl abl; used on the day of
	'iānuāriīs',
	'februāriīs',
	'mārtiīs',
	'aprīlibus',
	'maiīs',
	'iūniīs',
	'iūliīs',
	'augustīs',
	'septembribus',
	'octōbribus',
	'novembribus',
	'decembribus',
];
const monthsAcc = [ // f pl acc; used before the day
	'iānuāriās',
	'februāriās',
	'mārtiās',
	'aprīlēs',
	'maiās',
	'iūniās',
	'iūliās',
	'augustās',
	'septembrēs',
	'octōbrēs',
	'novembrēs',
	'decembrēs',
];
const numerals = [ // m s acc
	'tertium',
	'quārtum',
	'quīntum',
	'sextum',
	'septimum',
	'octāvum',
	'nōnum',
	'decimum',
	'ūndecimum',
	'duodecimum',
	'tertium decimum',
	'quārtum decimum',
	'quīntum decimum',
	'sextum decimum',
	'septimum decimum',
	'duodēvīcēsimum',
	'ūndēvīcēsimum',
];

/** ab urbe condita */
function auc(){
	return romanNumeral(new Date().getFullYear() + 753) + ' AUC';
}

function romanFULL(){
	return romanDOTW() + ' ' + roman() + ' ' + auc();
}

function romanDOTW(){
	const dotw = new Date().getDay(); // 0=sun
	return 'diēs ' + days[dotw];
}

function roman(){
	const day = new Date().getDate(); // 1-indexed
	const month = new Date().getMonth(); // 0-indexed
	const year = new Date().getFullYear();
	const nextMonth = new Date(year, month+1, 1).getMonth(); // 0-indexed
	const numberOfDaysInTheMonth = new Date(year, month+1, 0).getDate();
	const ides = numberOfDaysInTheMonth === 31 ? 15 : 13;
	const nones = ides - 8;
	const numberOfDaysBeforeNextKalends = numberOfDaysInTheMonth - (ides ? 15 : 13);
	console.debug(day, month, year, ';', nones, ides, numberOfDaysInTheMonth);
	if (day === 1)
		return 'kalendīs ' + monthsAbl[month];
	if (1 < nones - day)
		return 'ante diem ' + numerals[nones - day - 2] + ' nōnās ' + monthsAcc[month];
	if (day === nones - 1)
		return 'prīdiē nōnās ' + monthsAcc[month];
	if (day === nones)
		return 'nōnīs ' + monthsAbl[month];
	if (1 < ides - day)
		return 'ante diem ' + numerals[ides-2-day] + ' īdūs ' + monthsAcc[month];
	if (day === ides - 1)
		return 'prīdiē īdūs ' + monthsAcc[month];
	if (day === ides)
		return 'īdibus' + monthsAbl[month];
	// at this point all that remains is the time before the Kalends...
	if (day === numberOfDaysInTheMonth)
		return 'prīdiē kalendās ' + monthsAcc[nextMonth];
	return 'ante diem ' + numerals[numberOfDaysBeforeNextKalends + ides - day] + ' kalendās ' + monthsAcc[nextMonth];
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('romandate')
		.setDescription('show current date in latin'),
	async execute(interaction){
		return interaction.reply(`:eagle: ${romanFULL()}`);
	},
};