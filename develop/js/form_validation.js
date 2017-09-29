/* --------------------------------------------------------------
	フォームバリデーション
---------------------------------------------------------------- */
(function($) {
$(function() {
	var $form              = $('form');
	var $formItem          = $('.js-formItem');
	var $formItemBody      = $('.js-formItemBody');
	var $formItemLabel     = $('.js-formItemLabel');
	var $submit            = $('.js-submit');
	var $validate          = $('.js-validate');
	var $required          = $('.js-required');
	var $checkRequired     = $('.js-checkRequired');
	var $validateTextGroup = $('.js-validateTextGroup');
	var $symbol            = $('.js-symbol');
	var $katakana          = $('.js-katakana');
	var $alphabet          = $('.js-alphabet');
	var $number            = $('.js-number');
	var $zip               = $('.js-zip');
	var $tel               = $('.js-tel');
	var $url               = $('.js-url');
	var $email             = $('.js-email');
	var $emailCheck        = $('.js-emailCheck');
	var $password          = $('.js-password');
	var $passwordCheck     = $('.js-passwordCheck');
	var className = {
		error    : 'is-error', // エラー発生時にフォーム要素自身に付与されるclass名
		errorItem: 'formItemError' // エラー文言を表示する要素のclass名
	};
	var message = {
		required     : '必須項目です。',
		symbol       : '記号が含まれています。',
		katakana     : 'カタカナのみ入力可能です。',
		alphabet     : '半角英語のみ入力可能です。',
		number       : '数値のみ入力可能です。',
		zip          : '郵便番号の形式が異なります。',
		tel          : '電話番号の形式が異なります。',
		url          : 'URLの形式が異なります。',
		email        : 'メールアドレスの形式が異なります。',
		emailCheck   : '入力したメールアドレスと内容が異なります。',
		password     : '6文字以上「半角の英字と数字」を組み合わせてください。',
		passwordCheck: '入力したパスワードと内容が異なります。'
	};
	({
		// 初期化
		init: function() {
			var self = this;
			$(function() {
				self.blur();
				self.change();
				self.submit();
			});
		},

		// フォーカスが外れたら
		blur: function() {
			var self = this;
			$validate.on('blur', function() {
				self.validateText($(this));
			});
		},

		// チェックが変更されたら
		change: function() {
			var self = this;
			$checkRequired.each(function() {
				var $self = $(this);
				$self.find($(':radio, :checkbox')).on('change', function() {
					self.validateChecked($self);
				});
			});
		},

		// 送信
		submit: function() {
			var self = this;
			$form.each(function() {
				var $self = $(this);
				// 確認ボタンクリックで送信
				$self.find($submit).on('click', function() {
					$(this).closest($form).submit();
				});
				// 送信時チェック
				$self.on('submit', function() {
					// 文字列のバリデーション
					$self.find($validate).each(function() {
						self.validateText($(this));
					});
					// チェックのバリデーション
					$self.find($checkRequired).each(function() {
						self.validateChecked($(this));
					});
					// 送信を中止し、最初のエラー要素までスクロール
					if ($self.find($('.' + className.errorItem)).length) {
						var scrollTarget = $self.find($('.' + className.errorItem)[0]).closest($formItem).offset().top;
						$('html,body').animate({scrollTop: scrollTarget}, 'slow');
						return false;
					}
				});
			});
		},

		// エラー文言の先頭にラベルを挿入
		insertLabel: function(target) {
			if (target.closest($formItem).find($formItemLabel).length) {
				return target.closest($formItem).find($formItemLabel).text() + 'は';
			} else {
				return '';
			}
		},

		// チェック項目の必須チェック
		validateChecked: function(target) {
			var self   = this;
			var $error = target.closest($formItem).find('.' + className.errorItem);
			var label  = self.insertLabel(target);
			// エラーメッセージの挿入
			if (target.find($(':radio:checked, :checkbox:checked')).length === 0) {
				target.closest($formItemBody).append('<p class="' + className.errorItem + '">' + label + message.required + '</p>');
			}
			if ($error.length) {
				$error.remove();
			}
		},

		// 文字列のチェック
		validateText: function(target) {
			var self   = this;
			var val    = target.val();
			var $error = target.closest($formItem).find('.' + className.errorItem);
			var label  = self.insertLabel(target);
			// エラーメッセージの挿入
			var insertErrorMsg = function(errorMsg, label) {
				if ($error.length) {
					$error.remove();
				}
				if (label) {
					target.addClass(className.error).closest($formItemBody).append('<p class="' + className.errorItem + '">' + label + errorMsg + '</p>');
				} else {
					target.addClass(className.error).closest($formItemBody).append('<p class="' + className.errorItem + '">' + errorMsg + '</p>');
				}
			};
			// エラーメッセージの削除
			var removeError = function() {
				if ($error.length) {
					target.removeClass(className.error);
				}
				if (target.closest($validateTextGroup).length) {
					var len = target.closest($validateTextGroup).find('.' + className.error).length;
					if (len === 0) {
						$error.remove();
					}
				} else {
					$error.remove();
				}
			};
			// 入力文字の判定
			var checkStringType = function(str, type) {
				var reg;
				switch(type) {
					// 漢字の判定
					case 'isKanji':
						reg = /(?:[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])/;
						break;
					// ひらがなの判定
					case 'isHiragana':
						reg = /[ぁ-ん]/;
						break;
					// 全角カタカナの判定
					case 'isKatakana':
						reg = /[ァ-ン]/;
						break;
					// 半角カタカナの判定
					case 'isHalfKatakana':
						reg = /[ｧ-ﾝﾞﾟ]/;
						break;
					// 全角アルファベットの判定
					case 'isAlphabet':
						reg = /[ａ-ｚＡ-Ｚ]/;
						break;
					// 半角アルファベットの判定
					case 'isHalfAlphabet':
						reg = /[a-zA-Z]/;
						break;
					// 全角数字の判定
					case 'isNumber':
						reg = /[０-９]/;
						break;
					// 半角数字の判定
					case 'isHalfNumber':
						reg = /[0-9]/;
						break;
				}
				if (str.match(reg)) {
					return true;
				}
				return false;
			};
			// 全角を半角に変換
			var convertHalfSize = function(val) {
				// 全角英語を変換
				if (checkStringType(val, 'isAlphabet')) {
					val = val.replace(/[ａ-ｚＡ-Ｚ]/g, function(s) {
						return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
					});
				}
				// 全角数字を変換
				if (val.match(/[０-９]/)) {
					val = val.replace(/[０-９]/g, function(s) {
						return String.fromCharCode(s.charCodeAt(0) - 65248);
					});
				}
				return val;
			};
			// 非表示の要素はエラーを削除
			if (!target.is(':visible')) {
				removeError();
			}
			// 必須項目のチェック
			target.filter($required).each(function() {
				if (val === '') {
					insertErrorMsg(message.required, label);
				} else {
					removeError();
				}
			});
			// 記号のチェック
			target.filter($symbol).each(function() {
				if (val != '') {
					var array = val.split('');
					var symbolflg = false;
					for (var i = 0; i < array.length; i++) {
						var str = array[i];
						if (checkStringType(str, 'isKanji') || checkStringType(str, 'isHiragana') || checkStringType(str, 'isKatakana') || checkStringType(str, 'isHalfKatakana') || checkStringType(str, 'isAlphabet') || checkStringType(str, 'isHalfAlphabet')) {
						} else {
							insertErrorMsg(message.symbol);
							symbolflg = true;
							break;
						}
					}
					if (!symbolflg) {
						removeError();
					}
				}
			});
			// 数値のチェック
			target.filter($number).each(function() {
				if (val != '') {
					val = convertHalfSize(val);
					target.val(val);
					if (checkStringType(val, 'isHalfNumber')) {
						removeError();
					} else {
						insertErrorMsg(message.number, label);
					}
				}
			});
			// 英語のチェック
			target.filter($alphabet).each(function() {
				if (val != '') {
					val = convertHalfSize(val);
					target.val(val);
					if (checkStringType(val, 'isHalfAlphabet')) {
						removeError();
					} else {
						insertErrorMsg(message.alphabet, label);
					}
				}
			});
			// 郵便番号のチェック
			target.filter($zip).each(function() {
				if (val != '') {
					val = convertHalfSize(val);
					target.val(val);
					// ハイフンを削除
					if (val.match(/[-－ー]/)) {
						val = val.replace(/[-－ー]/g, '');
						target.val(val);
					}
					if (val.match(/^[0-9]{7}$/)) {
						removeError();
						// ajaxzip3
						AjaxZip3.zip2addr(this, '', 'address', 'address');
						AjaxZip3.zip2addr('postal-code', '', 'address-level1', 'address-level2');
					} else {
						insertErrorMsg(message.zip);
					}
				}
			});
			// 電話番号のチェック
			target.filter($tel).each(function() {
				if (val != '') {
					val = convertHalfSize(val);
					target.val(val);
					// ハイフンを削除
					if (val.match(/[-－ー]/)) {
						val = val.replace(/[-－ー]/g, '');
						target.val(val);
					}
					if (val.match(/^[0-9]{9,12}$/)) {
						removeError();
					} else {
						insertErrorMsg(message.tel);
					}
				}
			});
			// カタカナのチェック
			target.filter($katakana).each(function() {
				if (val != '') {
					var kanaMap = {
						'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
						'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
						'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
						'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
						'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
						'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
						'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
						'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
						'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
						'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
						'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
						'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
						'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
						'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
						'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
						'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
						'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
						'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
						'｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
					};
					// ひらがなを変換
					if (checkStringType(val, 'isHiragana')) {
						val = val.replace(/[ぁ-ん]/g, function(s) {
							return String.fromCharCode(s.charCodeAt(0) + 0x60);
						});
						target.val(val);
					}
					// 半角カタカナがある場合
					if (checkStringType(val, 'isHalfKatakana')) {
						var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
						val = val.replace(reg, function(match) {
								return kanaMap[match];
							})
							.replace(/ﾞ/g, '゛')
							.replace(/ﾟ/g, '゜');
						target.val(val);
					}
					if (val && !val.match(/^[ァ-ロワヲンー　\s]*$/)) {
						insertErrorMsg(message.katakana, label);
					} else {
						removeError();
					}
				}
			});
			// urlのチェック
			target.filter($url).each(function() {
				if (val != '') {
					if (!val.match(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/)) {
						insertErrorMsg(message.url);
					} else {
						removeError();
					}
				}
			});
			// メールアドレスのチェック
			target.filter($email).each(function() {
				if (val != '') {
					if (val && !val.match(/.+@.+\..+/g)) {
						insertErrorMsg(message.email);
					} else {
						removeError();
					}
				}
			});
			// メールアドレス確認のチェック
			target.filter($emailCheck).each(function() {
				if (val != '') {
					if ($(this).val() && $(this).val() != $("input[name=" + $(this).attr("name").replace(/^(.+)-check$/, "$1")+"]").val()) {
						insertErrorMsg(message.emailCheck);
					} else {
						removeError();
					}
				}
			});
			// パスワードのチェック
			target.filter($password).each(function() {
				if (val != '') {
					val       = convertHalfSize(val);
					var count = String(val).length;
					target.val(val);
					if (checkStringType(val, 'isHalfAlphabet') && checkStringType(val, 'isHalfNumber') && count >= 6) {
						removeError();
					} else {
						insertErrorMsg(message.password, label);
					}
				}
			});
			// パスワード確認のチェック
			target.filter($passwordCheck).each(function() {
				if (val != '') {
					if ($(this).val() && $(this).val() != $("input[name=" + $(this).attr("name").replace(/^(.+)-check$/, "$1")+"]").val()) {
						insertErrorMsg(message.passwordCheck);
					} else {
						removeError();
					}
				}
			});
		}
	}.init());
});
})(jQuery);