<?php
/**
 * 特殊文字を HTML エンティティに変換する
 */
function hsc($str) {
	return htmlspecialchars($str, ENT_QUOTES, 'utf-8');
}

/**
 * 特殊文字を HTML エンティティに変換する
 * 且つ、改行コードをBRタグへ変換する
 */
function hscBr($str) {
	return nl2br(hsc($str));
}

/**
 * 「氏名」を得る
 * ２つの値を「GLUE_NAME」で結合し、１つの文字列として作成
 */
function getName($name01, $name02) {
	return $name01 . GLUE_NAME . $name02;
}

/**
 * 「郵便番号」を得る
 * ２つの値を「GLUE_ZIP」で結合し、１つの文字列として作成
 */
function getZip($zip01, $zip02) {
	return $zip01 . GLUE_ZIP . $zip02;
}

/**
 * 「電話番号」を得る
 * ３つの値を「GLUE_TEL_L」「GLUE_TEL_R」で結合し、１つの文字列として作成
 */
function getTel($tel01, $tel02, $tel03) {
	return $tel01 . GLUE_TEL_L . $tel02 . GLUE_TEL_R . $tel03;
}

/**
 * チェックボックスで選択された項目を得る
 * チェックボックスで選択された項目を「GLUE_CHECKED」で結合し、一つの文字列として作成
 */
function getChecked($items) {
	foreach ($items as $val) {
		if (isset($val) && strlen($val) > 0) {
			$checked[] = $val;
		}
	}
	return implode(GLUE_CHECKED, $checked);
}
