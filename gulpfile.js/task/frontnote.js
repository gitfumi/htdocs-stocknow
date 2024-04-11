/*
 * フォントスタイル
 */
// **********************************************
// require
// **********************************************
const config = require('../config');

const gulp = require('gulp');
const frontnote = require('gulp-frontnote'); // フォントスタイル

// frontnote
let frontnoteList = [];
// 対象ファイルを整列
for (var i = 0; i < config.frontnone.targetFile.length; i++) {
	frontnoteList[i] = config.root.src + config.frontnone.targetFile[i]
}

// **********************************************
// FrontNote set
// **********************************************
module.exports = {
	taskFrontnote: () =>{
		return gulp
			.src(frontnoteList)
			.pipe(frontnote({
				out   : config.root.src + config.frontnone.outPutDir, // スタイルガイドの作成フォルダ
				css   : config.frontnone.includeCss,         // スタイルガイドに読み込ませるCSS
			}));
	}
}