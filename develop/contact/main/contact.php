<?php
//共通設定を読み込み
require_once(DIR_BASE . 'config/const.php');
//パラメータを読み込み
require_once(DIR_BASE . 'config/param.php');
//共通処理を読み込み
require_once(DIR_COMM . 'utl.php');
//共通処理を読み込み（テンプレート用）
require_once(DIR_COMM . 'utlFunctions.php');
//共通処理を読み込み（メール送信関連）
require_once(DIR_COMM . 'utlMail.php');
//問い合わせ内容の処理共通処理を読み込み
require_once(DIR_COMM . 'inquiry.php');

/**
 * お問合せ関連処理
 */
class Contact {
	private $_inquiry;
	private $_param;
	function __construct() {
		$this->_inquiry = new Inquiry();
		$this->_param = new Param();
	}

	/**
	 * 送信済かを判定
	 */
	private function isSent($donekey = ATTR_DONE) {
		if (isset($_SESSION[$donekey]) && $_SESSION[$donekey] === STATUS_SENT) {
			return true;
		}
		return false;
	}

	/**
	 * 正しい遷移かを判定
	 */
	private function isCorrectRedirect($ticketKey = ATTR_TICKET)
	{
		if ((isset($_SESSION[$ticketKey]) && isset($_POST[$ticketKey]))
			&& strlen(trim($_SESSION[$ticketKey])) > 0
			&& $_SESSION[$ticketKey] === $_POST[$ticketKey]
		) {
			return true;
		}
		return false;
	}

	/**
	 * 送信済みフラグを解除
	 */
    private function unsetSendFlag(
		$ticketKey = ATTR_TICKET,
		$donekey = ATTR_DONE)
	{
		if (isset($_SESSION[$ticketKey])
			&& ((isset($_SESSION[$donekey]) && $_SESSION[$donekey] === STATUS_SENT))
		) {
			unset($_SESSION[$donekey]);
		}
	}

	/**
	 * 送信済みユーザ名を解除
	 */
	private function unsetSendUsrName($usrkey = ATTR_USR) {
		if (isset($_SESSION[$usrkey])) {
			unset($_SESSION[$usrkey]);
		}
	}

	/**
	 * 指定画面へ遷移
	 */
	private function redirectForm($formName) {
		header('Location: ' . $formName);
		exit();
	}

	/**
	 * 入力画面へ遷移
	 */
	public function redirectIndex() {
		$this->redirectForm(FILE_INDEX);
	}

	/**
	 * 完了画面へ遷移
	 */
	public function redirectThanks() {
		$this->redirectForm(FILE_THANKS);
	}

	/**
	 * 入力画面を表示
	 */
	public function formIndex($itype = ITYPE_DEF) {
		$donekey = ATTR_DONE . $itype;
		$ticketKey = ATTR_TICKET . $itype;

//笹崎さんからの指示でチェックしないように変更。2017/03/24 -start-
// 		//送信済かをチェック
// 		if ($this->isSent($donekey)) {
// 			//チケットクリア（後続のconfirmではじかれる様に）
// 			// sessionに値が入っていなくても、「戻る」で遷移してきた場合の表示をクリアできない為
// 			$$ticketKey = '';
// 		} else {
// 			//チケットとしてユニーク値をセット
// 			$$ticketKey = Utl::getUniq();
// 		}
		//チケットとしてユニーク値をセット
		$$ticketKey = Utl::getUniq();
//笹崎さんからの指示でチェックしないように変更。2017/03/24 -end-

		$_SESSION[$ticketKey] = $$ticketKey;

		//セッションから必要な情報を取得
		$this->_param = $this->_inquiry->session2Param($this->_param);
		$errParam = $this->_inquiry->session2ErrParam();
		//パラメータを展開し、テンプレートでの記述を簡略化

		foreach ($this->_param as $k => $v) {
			$$k = $v;
		}
		foreach ($errParam as $k => $v) {
			$$k = $v;
		}
		//値が無ければ初期値をセット
		// ラジオボタン

		//フォームをテンプレートから取得
		include_once(TMPL_INDEX);
	}

	/**
	 * 確認画面を表示
	 */
	public function formConfirm($itype = ITYPE_DEF) {
		//二重送信チェック
		$ticketKey = ATTR_TICKET . $itype;
		if (!$this->isCorrectRedirect($ticketKey)) {
			$donekey = ATTR_DONE . $itype;
			$this->unsetSendFlag($ticketKey, $donekey);
			$usrkey = ATTR_USR . $itype;
			$this->unsetSendUsrName($usrkey);
			//入力画面へ遷移
			$this->redirectIndex();
		}

		//セッション情報を破棄
		$this->_inquiry->delSession();
		session_start();
		//チケットとしてユニーク値をセット
		$$ticketKey = Utl::getUniq();
		$_SESSION[$ticketKey] = $$ticketKey;

		//パラメータ値を取得
		$this->_param = $this->_inquiry->getParam($this->_param);

		//エラー有りかを判定
		if (isset($_SESSION['errParam'])) {
			//入力画面へ遷移
			$this->redirectIndex ();
		}

		//パラメータを展開し、テンプレートでの記述を簡略化
		foreach ($this->_param as $k => $v) {
			$$k = $v;
		}
		//質問の1行の長さを加工し、見た目を調整
		// $inquiries = Utl::addCRLF($inquiries, MAX_LEN_MAIL_COL);

		//フォームをテンプレートから取得
		include_once(TMPL_CONFIRM);
	}

	/**
	 * 完了画面を表示（ありがとうございました画面）
	 */
	public function formThanks($itype = ITYPE_DEF) {
		$usrkey = ATTR_USR . $itype;
		//送信先の氏名を取得
		$$usrkey = isset($_SESSION[$usrkey])? trim($_SESSION[$usrkey]) : '';

		//フォームをテンプレートから取得
		include_once(TMPL_THANKS);
	}

	/**
	 * パラメータを加工後に、管理者宛てのメールを送信
	 */
	public function sendAdm($tmplFile, $fromName, $param) {
		//パラメータを加工（追加分）
		// 日時
		$param->date = date('Y/m/d H:i:s');

		// 氏名
		// $param->name = getName($param->name);

		//パラメータを加工（変更分）
		// ご質問
		$param->inquiries = Utl::addCRLF($param->inquiries, MAX_LEN_MAIL_COL, true);

		//メールを送信
		utlMail::sendEmailAdm($tmplFile, $fromName, $param);
	}

	/**
	 * メールを送信
	 */
	public function sendEmail($itype = ITYPE_DEF) {

		$ticketKey = ATTR_TICKET . $itype;
		$usrkey = ATTR_USR . $itype;
		//二重送信チェック
		if (!$this->isCorrectRedirect($ticketKey)) {
			//入力画面へ遷移
			$this->redirectIndex();
		}

		//タイムゾーンを設定する
		date_default_timezone_set('Asia/Tokyo');

		//セッションから必要な情報を取得
		$this->_param = $this->_inquiry->session2Param($this->_param);


		//管理者へ送信
		$fromName = "" . MAIL_FROM;
		// $tmplFile = DIR_TMPL.'msgAdm.mail';
		// utlMail::sendEmailAdm($tmplFile, $fromName, $this->_param);
		$this->sendAdm(TMPL_MAIL_MSG_ADM, $fromName, $this->_param);

		//お客様宛て
		// メールアドレスが設定されていれば送信
		$mail = $this->_param->email;
		if (strlen($mail) > 0) {
			utlMail::sendEmailUsr(TMPL_MAIL_MSG_USR, $fromName, $this->_param);
		}
		// 氏名をサンクス画面表示様に取得
		// $$usrkey = getName($this->_param->name);
		$$usrkey = $this->_param->name;

		//セッション情報を破棄
		$this->_inquiry->delSession();
		session_start();

		//送信済フラグを立てる
		$donekey = ATTR_DONE . $itype;
		$_SESSION[$donekey] = STATUS_SENT;
		//送信先の氏名をセット（サンクス画面に表示用）

		$_SESSION[$usrkey] = $$usrkey;
	}
}
