<?php
//メール設定を読み込み
require_once(DIR_BASE . 'config/mail.php');

/**
 * メール送信関連
 */
class utlMail {
	function __construct() {
	}

	/**
	 * メールヘッダを作成（管理者）
	 */
	private static function getMailHeadAdm($fromName, &$addHeadAdm) {
		//文字列内で定数を展開する為に設定
		// 「{$」で変数の展開が行われる場合、関数の実行が可能
		$const = 'constant';
		//ヘッダを設定
		$fromName = mb_encode_mimeheader($fromName);
		$addHeadAdm = "From: {$fromName}<{$const('MAIL_ADD_RETURN')}>\r\n" . "CC: {$const('MAIL_ADD_CC_ADM')}\r\n" . "Return-Path: {$const('MAIL_ADD_RETURN')}\r\n" . "Reply-To: {$const('MAIL_ADD_REPLY')}\r\n" . 'X-Mailer: PHP/' . phpversion();
	}

	/**
	 * メールヘッダを作成（お客様）
	 */
	private static function getMailHeadUsr($fromName, &$addHeadUsr) {
		//文字列内で定数を展開する為に設定
		// 「{$」で変数の展開が行われる場合、関数の実行が可能
		$const = 'constant';
		//ヘッダを設定
		$fromName = mb_encode_mimeheader($fromName);
		$addHeadUsr = "From: {$fromName}<{$const('MAIL_ADD_RETURN')}>\r\n" . "Return-Path: {$const('MAIL_ADD_RETURN')}\r\n" . "Reply-To: {$const('MAIL_ADD_REPLY')}\r\n" . 'X-Mailer: PHP/' . phpversion();
	}

	/**
	 * 文字列にパラメータ値をセット
	 */
	private static function setParam2str($param, &$str) {
		//パラメータ値をセット
		foreach ($param as $k => $v) {
			//半角カナを全角へ変換
			$val = mb_convert_kana($v, 'KV', 'utf-8');
			//セット
			$str = preg_replace("/\<\%$k\%\>/", $val, $str);
		}
	}

	/**
	 * メール本文を作成（管理者）
	 */
	private static function getMailMsgAdm($tmplFile, $param, &$msgAdm) {
		//メール本文用テンプレートを取得
		$msgAdm = file_get_contents($tmplFile);
		//パラメータ値をセット
		self::setParam2str($param, $msgAdm);
	}

	/**
	 * メール本文を作成（お客様）
	 */
	private static function getMailMsgUsr($tmplFile, $param, &$msgUsr) {
		$msgUsr = file_get_contents($tmplFile);
		//ユーザ名をセット
		// $p['name'] = $param->name;
		self::setParam2str($param, $msgUsr);
	}

	/**
	 * メール件名を作成（管理者）
	 */
	private static function getMailSubjectAdm($param, &$subjectAdm) {
		$subjectAdm = MAIL_SUBJECT_ADM;
		//ユーザ名をセット
		$p['name'] = $param->name;
		self::setParam2str($p, $subjectAdm);
	}

	/**
	 * メールを送信（管理者）
	 */
	public static function sendEmailAdm($tmplFile, $fromName, $param) {
		//管理者へ送信
		mb_language('ja');
		mb_internal_encoding('utf-8');
		//メールヘッダを取得
		self::getMailHeadAdm($fromName, $addHeadAdm);
		//メール本文を取得
		self::getMailMsgAdm($tmplFile, $param, $msgAdm);
		//件名を取得
		self::getMailSubjectAdm($param, $subjectAdm);
		//メールを送信
		$addParam = '-f ' . MAIL_ADD_RETURN;
		mb_send_mail(MAIL_ADD_ADM, $subjectAdm, $msgAdm, $addHeadAdm, $addParam);
	}

	/**
	 * メールを送信（お客様）
	 */
	public static function sendEmailUsr($tmplFile, $fromName, $param) {
		//お客様へ送信
		mb_language('ja');
		mb_internal_encoding('utf-8');
		$subjectUsr = MAIL_SUBJECT_USR;
		//メールヘッダを取得
		self::getMailHeadUsr($fromName, $addHeadUsr);
		//メール本文を取得
		self::getMailMsgUsr($tmplFile, $param, $msgUsr);
		//メールを送信
		$addParam = '-f ' . MAIL_ADD_RETURN;
		mb_send_mail($param->email, $subjectUsr, $msgUsr, $addHeadUsr, $addParam);
	}
}
