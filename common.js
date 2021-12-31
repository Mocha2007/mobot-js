// pseudoclasses

const random = {
	bool(){
		return this.random() < 0.5;
	},
	/** @param {string | any[] | Set} iterable */
	choice(iterable){
		return Array.from(iterable)[this.randint(0, iterable.length-1)];
	},
	/**
	 * @param {number} min
	 * @param {number} max - inclusive
	 */
	randint(min, max){ // random integer in range
		return Math.floor(this.uniform(min, max+1));
	},
	/** [0, 1) ; just alias to Math.random */
	random: Math.random,
	/** @param {any[]} arr */
	shuffle(arr){
		const a = range(0, arr.length);
		const o = [];
		while (a.length){
			const i = a.splice(this.randint(0, a.length-1), 1)[0];
			o.push(arr[i]);
		}
		return o;
	},
	/**
	 * @param {number} min
	 * @param {number} max
	 */
	uniform(min, max){ // random real in range
		return this.random() * (max-min) + min;
	},
	/**
	 * @param {any[]} arr
	 * @param {number[]} weights
	 */
	weightedChoice(arr, weights){
		const s = sum(weights);
		weights = weights.map(w => w/s); // normalize
		const r = this.random();
		let z = 0;
		let i = 0;
		for (i = 0; i < arr.length; i++){
			z += weights[i];
			if (r <= z)
				break;
		}
		return arr[i];
	},
};

/** works just like in python
 * @param {number} m min (inclusive)
 * @param {number} [n] max (exclusive)
 * @return {number[]}
*/
function range(m, n, step = 1){
	if (step !== 1)
		return Array.from(Array(Math.ceil((n-m)/step)).keys()).map(i => i*step+m);
	if (n === undefined)
		return Array.from(Array(m).keys());
	return range(n-m).map(i => i + m);
}

// https://stackoverflow.com/a/46825815/2579798
function restart(interaction){
	interaction.channel.send(`PID: ${process.pid}`).catch(console.error);
	setTimeout(() => {
		process.on('exit', () => {
			require('child_process').spawn(process.argv.shift(), process.argv, {
				cwd: process.cwd(),
				detached: true,
				stdio: 'inherit',
			});
		});
		process.exit();
	}, 5000);
}

/**
 * @param {number} n
 * @returns {string}
*/
function romanNumeral(n){
	n = Math.abs(Math.round(n)); // force in N
	if (n < 10)
		return romanNumeral.digits[n];
	else if (n < 100){
		const remainder = n % 10;
		const wholePart = Math.floor(n/10);
		return romanNumeral(wholePart).replace(/X/g, 'C').replace(/V/g, 'L').replace(/I/g, 'X')
			+ romanNumeral(remainder);
	}
	else if (n < 1000){
		const remainder = n % 100;
		const wholePart = Math.floor(n/100);
		return romanNumeral(wholePart).replace(/X/g, 'M').replace(/V/g, 'D').replace(/I/g, 'C')
			+ romanNumeral(remainder);
	}
	// otherwise over 1K
	const thousands = Math.floor(n/1000);
	return new Array(thousands).fill('M').join('') + romanNumeral(n - thousands*1000);
}
romanNumeral.digits = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

/** @param {number[]} arr */
function sum(arr){
	return arr.reduce((a, b) => a + b, 0);
}

// exports...

module.exports = {
	random,
	range,
	restart,
	romanNumeral,
	sum,
};