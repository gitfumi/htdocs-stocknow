// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// sass set
// **********************************************
module.exports = {
	taskSass: () => {
		return $.gulp.src(config.root.src + config.sass.format)
		// エラーが起こっても停止させない
		.pipe($.plumber({
			errorHandler: $.notify.onError("Error: <%= error.message %>")
		}))
		// ディレクトリ単位でのsassのimportを可能にする
		.pipe($.sassGlob())
		// sassのコンパイル
		.pipe($.sass({
			outputStyle: 'expanded'
		}))
		// ベンダープレフィックスの付与
		.pipe($.postcss(
			[
				$.autoprefixer({
					browsers: [
						'last 2 version',
						'ie >= 11',
						'iOS >= 9',
						'Android >= 4'
					]
				})
			]
		))
		.pipe($.gulp.dest(config.root.src));
	}
}