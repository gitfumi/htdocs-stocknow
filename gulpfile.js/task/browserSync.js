/*
 * BrowserSync
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// BrowserSync set
// **********************************************
module.exports = {
	taskMove: () =>{
		return $.browserSync.init({
			proxy: {
				target: config.host,
				middleware: function(req, res, next) {
					var url = req.url.match(/^.*\/(.+\.html)?$/);
					if (url) {
						if (url.input.match(/\/$/)) {
							config.browserSync.viewPage = url.input + 'index.html';
						} else {
							config.browserSync.viewPage = url.input;
						}
					}
					next();
				}
			},
			open: 'external'
		});
	}
}