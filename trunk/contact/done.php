<?php
//当処理で相対パスの基準となる位置を取得
define('DIR_BASE', dirname( __FILE__ ) . '/');
//共通設定を読み込み
require_once(DIR_BASE . 'config/const.php');
//お問合せ関連処理を読み込み
require_once(DIR_MAIN . 'contact.php');
//セッションの開始
session_start();
//メール送信後、完了画面を表示
$contact = new Contact();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$contact->sendEmail();
	//サンクス画面（自身）にGET送信
	$contact->redirectThanks();
} else {
	//完了画面を表示
	$contact->formThanks();
}
