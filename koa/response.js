module.exports = {
	get body() {
		return this._body;
	},
	set body(data) {
		this._body = data;
	},
	get status() {
		return this.reponse.statusCode;
	},
	set status(code) {
		this.reponse.statusCode = code;
	},
};
