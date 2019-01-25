/*
 * ファイルのコピー
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// clean set
// **********************************************
module.exports = {
	taskCopy: done =>{
		let escapelist = [
			config.root.src + '/**/*.*',
		];
		// 除外ファイルを整列
		for (var i = 0; i < config.copy.escapeFile.length; i++) {
			escapelist[i + 1] = '!' + config.root.src + config.copy.escapeFile[i]
		}
		return $.gulp.src(
			escapelist,
			{
				base: config.root.src,
				dot: true
			}
		)
		.pipe($.gulp.dest(config.root.dest));
	}
}
