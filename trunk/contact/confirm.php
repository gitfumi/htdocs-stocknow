<?php
//当処理で相対パスの基準となる位置を取得
define('DIR_BASE', dirname( __FILE__ ) . '/');
define('URL_BASE', $_SERVER["REQUEST_URI"]);
//共通設定を読み込み
require_once(DIR_BASE . 'config/const.php');
//お問合せ関連処理を読み込み
require_once(DIR_MAIN . 'contact.php');
//セッションの開始
session_start();
//確認画面を表示
$contact = new Contact();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$contact->formConfirm();
} else {
	//入力画面へ遷移
	$contact->redirectIndex();
}
