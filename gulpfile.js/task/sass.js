/*
 * SASS
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// SASS set
// **********************************************
module.exports = {
	taskSass: () => {
		return $.gulp.src(config.root.src + config.sass.targetFile)
		// エラーが起こっても停止させない
		.pipe($.plumber({
			errorHandler: $.notify.onError(config.plumber.errorMessage)
		}))
		// ディレクトリ単位でのsassのimportを可能にする
		.pipe($.sassGlob())
		// sassのコンパイル
		.pipe($.sass({
			outputStyle: 'expanded'
		}))
		// ベンダープレフィックスの付与
		.pipe($.postCss(
			[
				$.autoprefixer({
					browsers: config.autoprefixer.format
				})
			]
		))
		.pipe($.gulp.dest(config.root.src));
	}
}