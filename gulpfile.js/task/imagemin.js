/*
 * 画像の圧縮
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// タスクの実行
const compile = (srcPath) => {
	return $.gulp
		.src(srcPath)
		.pipe($.plumber())
		.pipe($.imagemin([
			$.pngquant({
				quality: [0.7, 0.8],
				speed: 1,
				floyd: 0
			}),
			$.mozjpeg({
				quality: 85,
				progressive: true
			}),
			$.imagemin.svgo(),
			$.imagemin.optipng(),
			$.imagemin.gifsicle()
		]))
		.pipe($.gulp.dest(config.root.temp));
};

// **********************************************
// imagemin set
// **********************************************
module.exports = {
	taskImagemin: done =>{
		// const temp = config.activeFile.path.replace(/develop/, '');
		// console.log(config.activeFile.path);
		console.log(config.activeFile.event);
		if(config.activeFile.event != 'unlink'){
			compile(config.activeFile.path);
			// $.del(config.activeFile.path).pipe()
		}

		// console.log('[ ' + config.activeFile.action + ' ] /' + config.root.dest + '/' + config.activeFile.relativePath);
		done();
	}
}