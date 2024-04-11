/*
 * 画像の圧縮
 */
// **********************************************
// require
// **********************************************
const config = require('../config'),
	gulp = require('gulp'),
	plumber = require('gulp-plumber'), // エラーが原因でタスクが強制停止することを防止するモジュー
	imagemin = require('gulp-imagemin'), // 画像圧縮
	pngquant = require('imagemin-pngquant'), // 「gulp-imagemin」でpngプロパティを使用するためのプラグイン
	mozjpeg = require('imagemin-mozjpeg'); // 「gulp-imagemin」でjpgプロパティを使用するためのプラグイン


// タスクの実行
const compile = (srcPath) => {
	return gulp
		.src(srcPath)
		.pipe(plumber())
		.pipe(imagemin([
			pngquant({
				// 圧縮率の指定
				quality: [.65, .8],
				// 圧縮スピードの指定。1が一番遅いが、圧縮率が高い。
				speed: 1,
				// ディザ処理をOFF。画像の圧縮方式。
				floyd: 0
			}),
			mozjpeg({
				quality:85,
				// プログレッシブjpegの設定。画像圧縮方式JPEG形式の拡張仕様の1種。
				progressive: true
			}),
			// svgの圧縮
			imagemin.svgo(),
			// pngquantでpng画像が暗くなってしまうバグを防ぐ
			imagemin.optipng(),
			// gifの圧縮
			imagemin.gifsicle()
		]))
		.pipe(gulp.dest(config.root.temp));
};

// **********************************************
// imagemin set
// **********************************************
module.exports = {
	taskImagemin: done =>{
		compile(config.root.src + config.imagemin.targetFile);
		done();
	}
}