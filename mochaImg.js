const fs = require('fs');
const { createCanvas } = require('canvas');
// https://github.com/Automattic/node-canvas

class Drawing {
	constructor(){
		// prepare canvas
		this.canvas = createCanvas(1024, 1024);
		this.ctx = this.canvas.getContext('2d');
	}
	/** @param {[number, number][]} nodes */
	drawPath(nodes, color = 'rgbs(255,0,0,1)'){
		// draw line
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		nodes.forEach(coords => this.ctx.lineTo(coords[0], coords[1]));
		this.ctx.stroke();
	}
	save(){
		// save image
		const buffer = this.canvas.toBuffer('image/png');
		fs.writeFileSync('temp/temp.png', buffer);
	}
}

module.exports = {
	Drawing: Drawing,
};