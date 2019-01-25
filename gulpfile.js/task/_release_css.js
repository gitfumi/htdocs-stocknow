/*
 * CSSプロパティ・メディアクエリの整理、圧縮
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// CSS set
// **********************************************
module.exports = {
	taskCss: done =>{
		const plugin = [
			// プロパティの整列
			$.cssDeclarationSorter({
				order: 'smacss'
			}),
			// メディアクエリの整理
			$.mqpacker({
				sort: $.mqpackerSort
			})
		];
		return $.gulp
			.src(config.root.dest + '/**/*.css')  // 全てのCSS（納品ファイル
			.pipe($.postCss(plugin))
			.pipe($.cssMinify()) // CSSの圧縮
			.pipe($.gulp.dest(config.root.dest)); // 書き出し先（納品ファイル）
	}
}