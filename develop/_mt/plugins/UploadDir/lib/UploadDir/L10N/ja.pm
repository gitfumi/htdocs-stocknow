# $Id:

package UploadDir::L10N::ja;

use strict;
use base 'UploadDir::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (
    'This plugin automatically switches the destination directory for the uploaded file by the file extension.' => 'ファイルのアップロード時に、ファイルの拡張子によってアップロード先のディレクトリを自動的に切り替えるプラグインです。',
    'Extensions:' => '拡張子',
    'Default directory:' => '標準のディレクトリ',
    'Determined by extensions' => '拡張子に応じて決定',
    'Extensions' => '拡張子',
    'Directory' => 'ディレクトリ',
    'Default' => '指定なし',
    'Show configuration' => '設定を表示',
    'Hide configuration' => '設定を隠す',
    'Error saving plugin settings: [_1]' => 'プラグインの設定を保存できません: [_1]',
    'Enable:' => '有効:',
    'Enabled this plugin by default.' => 'デフォルトでこのプラグインの機能を有効にする',
);

1;
