const { SlashCommandBuilder } = require('@discordjs/builders');
const { random } = require('../common.js');

/** http://www.golfscript.com/golfscript/syntax.html */
const re = /[a-zA-Z_][a-zA-Z0-9_]*|'(?:\\.|[^'])*'?|"(?:\\.|[^"])*"?|-?[0-9]+|#[^\n\r]*|./m;

/** @param {string} s */
function gs(s){
	return `${gs_raw(s)}`;
}

/** @param {a} s */
function gs_raw(s){
	const tokens = s.match(re);
	const stack = new Stack();
	tokens.forEach(token => {
		stack.apply(fromToken(token));
	});
	return stack.pop();
}

/** @param {boolean} b */
function b2i(b){
	return b ? 1 : 0;
}

const tokenFunctions = {
	'~': a => {
		switch (typeof a){
			case 'number':
				return ~a;
			case 'string':
				return gs_raw(a);
			default:
				return a; // todo [1 2 3]~ -> 1 2 3
		}
	},
	'`': a => JSON.stringify(a),
	'!': a => b2i(typeof a === 'object' ? !a.length : !a),
	'@': (a, b, c) => [b, c, a],
	// http://www.golfscript.com/golfscript/builtin.html
}

function fromToken(token){
	if (tokenFunctions[token])
		return tokenFunctions[token];
	// else todo...
}

class Stack {
	constructor(){
		this.data = [0];
	}
	apply(f){
		const args = [];
		switch (f.length){
			case 3:
				args.push(this.pop());
			case 2:
				args.push(this.pop());
			case 1:
				args.push(this.pop());
			default:
				const out = f(...args)
				if (typeof out === 'object')
					out.forEach(this.push);
				else
					this.push(out);
		}
	}
	peek(){
		return this.data.length ? this.data[this.data.length-1] : 0;
	}
	pop(){
		return this.data.length ? this.data.pop() : 0;
	}
	push(val){
		this.data.push(val);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gs')
		.setDescription('run a golfscript program')
		.addStringOption(option => option.setName('code').setDescription('code').setRequired(true)),
	async execute(interaction) {
		const code = interaction.options.getString('code');
		return interaction.reply(`${gs(code)}`).catch(console.error);
	},
};