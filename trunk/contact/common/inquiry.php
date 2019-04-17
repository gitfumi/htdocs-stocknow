<?php
//汎用処理の取得
require_once(DIR_COMM . 'utl.php');

/**
 * お問合せ内容の関連処理
 */
class Inquiry {
	function __construct() {
	}

	/**
	 * パラメータをPOST送信情報から取得
	 */
	public function post2Param($stdParam) {
		foreach ($_POST as $k => $v) {
			//間のハイフンを削除（zip-code等）
			$name = &$k;
			$name = preg_replace('/-/', '', $name);

			$receiveParam[$name] = $v;
		}

		$postParam = $stdParam;
		foreach ($stdParam as $k => $v) {
			//セット
			$postParam->$k = (isset($receiveParam[$k])) ? stripslashes($receiveParam[$k]) : '';
		}
		return $postParam;
	}

	/**
	 * パラメータをセッションへセット
	 */
	private function param2Session($param) {
		foreach ($param as $k => $v) {
			$_SESSION['inParam'][$k] = stripslashes($v);
		}
	}

	/**
	 * パラメータをセッションから取得
	 */
	public function session2Param($stdParam) {
		$inParam = $stdParam;
		if (isset($_SESSION['inParam'])) {
			foreach ($stdParam as $k => $v) {
				$inParam->$k = (isset($_SESSION['inParam'][$k])) ? stripslashes($_SESSION['inParam'][$k]) : '';
			}
		}
		return $inParam;
	}

	/**
	 * エラーパラメータをセッションから取得
	 */
	public function session2ErrParam() {
		$errParam = new stdClass ();
		if (isset($_SESSION['errParam'])) {
			foreach ($_SESSION['errParam'] as $k => $v) {
				$errParam->$k = stripslashes($v);
			}
		}
		return $errParam;
	}

	/**
	 * パラメータをチェックする（バリデーション）
	 */
	private function checkParam($param) {
		//エラー情報をクリア
		if (isset($_SESSION['errParam'])) {
			unset($_SESSION['errParam']);
		}
		// // ご質問
		// $s = $param->inquiries;
		// if (Utl::isOrverLen($s, MAX_LEN_S1)) {
		// $_SESSION['errParam']['errInquiries'] = MAX_LEN_S1.ERR_ORVER_LEN;
		// }
	}

	/**
	 * パラメータを取得
	 */
	public function getParam($param) {
		$param = $this->post2Param($param);
		$this->param2Session($param);
		$this->checkParam($param);

		return $param;
	}

	/**
	 * セッション変数の初期化
	 */
	public function delSession() {
		unset($_SESSION);
		session_destroy();
	}
}
