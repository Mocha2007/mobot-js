const axios = require('axios');

class Webpage {
	/**
	 * @param {string} url
	*/
	constructor(url){
		this.url = url;
		/** @type {string} */
		this.cache;
	}
	async source(){
		if (this.cache)
			return this.cache;
		let source;
		await axios.get(this.url).then((response) => source = response.data);
		return this.cache = source;
	}
}

module.exports = {
	Webpage,
};