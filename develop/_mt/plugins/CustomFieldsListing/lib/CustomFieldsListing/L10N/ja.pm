package CustomFieldsListing::L10N::ja;

use strict;
use base 'CustomFieldsListing::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (
    # config.yaml
    'Hajime Fujimoto' => '藤本　壱',
    'View values of custom fields in listing screen.' => '一覧画面にカスタムフィールドの値を表示します。',

    # plugin_config.tmpl
    'Enable native sort' => '高速並べ替え',
    'DFV_INSTALL' => '高速並べ替えを行うには、<a href="http://www.h-fj.com/blog/mt5plgdoc/defaultvaluesetter.php">DefalutValueSetter</a>プラグインをインストールし、未定義のカスタムフィールドを初期化する必要があります。',

    # Plugin.pm
    'On' => 'オン',
    'Off' => 'オフ',
    'Basename' => 'ベースネーム',
    'Tag(List)' => 'タグ(一覧)',
    'Default' => '既定値',
    'Required' => '必須',
    'Options' => 'オプション',
    'Description' => '説明',
    '(saved value)' => '(保存値)',
);

1;
