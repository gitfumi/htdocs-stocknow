/*
 * フォントスタイル
 */
// **********************************************
// require
// **********************************************
const $ = require('../plugin');
const config = require('../config');

// **********************************************
// FrontNote set
// **********************************************
module.exports = {
	taskFrontnote: (frontnoteList) =>{
		return $.gulp
			.src(frontnoteList)
			.pipe($.frontnote({
				out   : config.root.src + config.frontnone.outPutDir, // スタイルガイドの作成フォルダ
				css   : config.frontnone.includeCss,         // スタイルガイドに読み込ませるCSS
			}));
	}
}