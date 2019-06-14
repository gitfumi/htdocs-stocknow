/*
 * MtAppjQuery
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// MtAppjQuery set
// **********************************************
module.exports = {
	taskMtAppjQuery: done =>{
		return $.gulp
			.src(config.root.src + config.mtappjqury.targetFile)  // 全てのjs
			.pipe($.gulp.dest(config.root.src + config.mtappjqury.outPutDir)); // 書き出し先（納品ファイル）
	}
}