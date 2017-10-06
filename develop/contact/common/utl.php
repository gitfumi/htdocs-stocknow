<?php
/**
 * 共通処理
 */
class Utl {
	/**
	 * ユニーク値を得る
	 */
	public static function getUniq() {
		return sha1(uniqid(mt_rand(), true));
	}

	/**
	 * 文字数制限を超えているかをチェックする
	 */
	public static function isOrverLen($str, $maxLen) {
		return (mb_strlen($str, 'utf-8') > $maxLen) ? true : false;
	}

	/**
	 * 文字列を指定文字数毎に分割し、配列化
	 */
	public static function splitStr($str, $maxLen = 1) {
		//初期化
		mb_internal_encoding('utf-8');
		$ret = array();
		$len = mb_strlen($str, 'utf-8');
		if ($maxLen <= 0) {
			$maxLen = 1;
		}

		//分割
		for ($i = 0; $i < $len; $i += $maxLen) {
			$ret [] = mb_substr($str, $i, $maxLen, 'utf-8');
		}
		return $ret;
	}

	/**
	 * 文字列に改行を追加する
	 */
	public static function addCRLF($str, $maxLen, $delEmpRow = false) {

		//初期化
		$rlst = array();
		//1行毎に分割
		$rows = explode(PHP_EOL, $str);

		//１行を、最大文字数で分割
		foreach ($rows as $val) {
			if ($delEmpRow) {
				//前後の空白（全半角）を取り除き、長さが無ければ、空行とみなし処理対象外とする
				$wks = preg_replace( '/^[\s　]*(.*?)[\s　]*$/u', '$1', $val);
				if (strlen($wks) <= 0) {
					continue;
				}
			}
			//指定文字数で分割
			$slst = self::splitStr($val, $maxLen);
			//分割した値に、改行コードを付加し、戻り値へ加える
			$rlst[] .= implode(PHP_EOL, $slst);
		}
		//分割後の値を、全て改行コードで繋げて返す
		return implode(PHP_EOL, $rlst);
	}
}
