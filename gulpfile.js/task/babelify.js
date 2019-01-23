/*
 * ES6をES5に変換
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// babelify set
// **********************************************
module.exports = {
	taskBabelify: () =>{
		return $.browserify({
			entries: config.root.src + '/_js/common/_main.js',
			extensions: ['.js']
		})
		.transform($.babelify, {presets: ['@babel/preset-env']})
		.bundle()
		.on('error', function (err) {
			console.log('Error : ' + err.message);
			this.emit('end');
		})
		.pipe($.source('common.js'))
		.pipe($.gulp.dest(config.root.src + '/js/'));
	}
}