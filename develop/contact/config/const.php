<?php
//文字数の最大値
const MAX_LEN_D1 = 100;			//数値、平方メートル
const MAX_LEN_D2 = 7;			//郵便番号
const MAX_LEN_D3 = 4;			//TEL、FAX、年
const MAX_LEN_D4 = 2;			//月、日
const MAX_LEN_MAIL_ADD = 254;	//メールアドレス
const MAX_LEN_MAIL_COL = 38;	//メール本文の１行の長さ（２バイト文字前提）
const MAX_LEN_URL = 2083;		//URL
const MAX_LEN_S1 = 1000;		//textarea
const MAX_LEN_S2 = 50;			//TextBox、プルダウン

//結合文字列
const GLUE_CHECKED = ', ';	//選択項目
const GLUE_NAME = ' ';		//名前
const GLUE_TEL_L = '-';		//TEL（左側）
const GLUE_TEL_R = '-'; 	//TEL（右側）
const GLUE_ZIP = '-'; 		//郵便番号

//エラーメッセージ
const ERR_ORVER_LEN = '文字以内でご記入下さい。';
const ERR_REQUIRED = '必須項目です。';

//問合せ種別
define('ITYPE_DEF', 'contact');		//お問い合わせ
//属性名
define('ATTR_TICKET', 'ticket');	//チケット
define('ATTR_DONE', 'done');		//処理済
define('ATTR_USR', 'usr');			//送信済みユーザ名
//送信済みフラグ
define('STATUS_SENT', 'sent');

//ファイル名（拡張子含まず）
define('PREFIX_INDEX', 'index');
define('PREFIX_CONFIRM', 'confirm');
define('PREFIX_THANKS', 'done');

//使用するディレクトリパス
// 動的なので define で
define('DIR_COMM', DIR_BASE . 'common/');
define('DIR_INC', DIR_BASE . '../_inc/');
// define('DIR_INC_FM', DIR_BASE . '../_inc/form/');
// define('DIR_INC_HD', DIR_BASE . '../_inc/head/');
define('DIR_MAIN', DIR_BASE . 'main/');
define('DIR_TMPL', DIR_BASE . 'templates/');
define('FILE_INDEX', PREFIX_INDEX . '.php');
define('FILE_CONFIRM', PREFIX_CONFIRM . '.php');
define('FILE_THANKS', PREFIX_THANKS . '.php');
define('TMPL_INDEX', DIR_TMPL . PREFIX_INDEX . '.html');
define('TMPL_CONFIRM', DIR_TMPL . PREFIX_CONFIRM . '.html');
define('TMPL_THANKS', DIR_TMPL . PREFIX_THANKS . '.html');
define('TMPL_MAIL_MSG_ADM', DIR_TMPL . 'msgAdm.mail');
define('TMPL_MAIL_MSG_USR', DIR_TMPL . 'msgUsr.mail');
