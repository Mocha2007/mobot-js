const fs = require('fs');
const { createCanvas } = require('canvas');
// https://github.com/Automattic/node-canvas

class Drawing {
	constructor(){
		// prepare canvas
		this.size = 1024;
		this.canvas = createCanvas(this.size, this.size);
		this.ctx = this.canvas.getContext('2d');
	}
	/** @param {[number, number]} coords */
	drawDot(coords, r = 1, color = 'red'){
		this.ctx.fillStyle = color;
		this.ctx.ellipse(coords[0], coords[1], r, r);
	}
	/** @param {[number, number][]} nodes */
	drawPath(nodes, color = 'red'){
		// draw line
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		nodes.forEach(coords => this.ctx.lineTo(coords[0], coords[1]));
		this.ctx.stroke();
	}
	fill(color = 'black'){
		this.ctx.fillStyle = color;
		this.ctx.fill();
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