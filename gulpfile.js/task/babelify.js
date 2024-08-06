/*
 * ES6をES5に変換
 */
// **********************************************
// require
// **********************************************
const config = require('../config'),
	gulp = require('gulp'),
	browserify = require('browserify'), // javascript で requireを実現
	babelify = require('babelify'), // ECMAScript 2016をECMAScript 2015に変換
	source = require('vinyl-source-stream'); // babelifyで使用　※gulpは、vinyl というオブジェクトを用いるため、vinyl-source-stream で変換する

// **********************************************
// babelify set
// **********************************************
module.exports = {
	taskBabelify: () =>{
		return browserify({
			entries: config.root.src + config.browserify.targetFile,
			standalone: 'exportFunc',
			extensions: ['.js']
		})
		.transform(babelify, {presets: ['@babel/preset-env']})
		.bundle()
		.on('error', function (err) {
			console.log('Error : ' + err.message);
			this.emit('end');
		})
		.pipe(source(config.babelify.outPutFileName))
		.pipe(gulp.dest(config.root.src + config.babelify.outPutDir))
		// ブラウザの更新
		.pipe(browserSync.stream());
	}
}