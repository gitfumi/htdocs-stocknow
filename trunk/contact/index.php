<?php
//当処理で相対パスの基準となる位置を取得
define('DIR_BASE', dirname( __FILE__ ) . '/');
//共通設定を読み込み
require_once(DIR_BASE . 'config/const.php');
//お問合せ関連処理を読み込み
require_once(DIR_MAIN . 'contact.php');
//セッションの開始
session_start();
//入力画面を表示
$contact = new Contact();
$contact->formIndex();
