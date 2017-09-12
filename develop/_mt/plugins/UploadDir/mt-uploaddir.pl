# $Id: mt-uploaddir.pl 73 2017-07-27 07:36:24Z tajima $

package MT::Plugin::UploadDir;

use strict;
use MT::Plugin;
@MT::Plugin::UploadDir::ISA = qw(MT::Plugin);

my $DEFAULT_EXT = "audio:mp3,wma,m4a,midi,wav,aiff\n";
$DEFAULT_EXT .= "videos:mp4,m4v,mpeg,avi,mov,wmv\n";
$DEFAULT_EXT .= "images:bmp,jpg,jpeg,gif,tif,tiff,png\n";
$DEFAULT_EXT .= "text:txt\n";
$DEFAULT_EXT .= "docs:pdf,doc,xls,ppt\n";
$DEFAULT_EXT .= "src:pl,c,cc,pas,rb\n";
$DEFAULT_EXT .= "archive:bz2,cab,gz,jar,lzh,rar,tar,taz,zip\n";

use vars qw($PLUGIN_NAME $VERSION);
$PLUGIN_NAME = 'UploadDir';
$VERSION = '0.74';

use MT;
use MT::Util;
my $plugin_registries = MT->version_number >= 6.2 ? {
    schema_version => '1.0',
    system_config_template => \&system_template,
    registry => {
        object_types => {
            'blog' => {
                'enable_uploaddir' => 'integer meta',
            },
        },
    },
} : {};
my $plugin = new MT::Plugin::UploadDir({
    name => $PLUGIN_NAME,
    version => $VERSION,
    description => "<MT_TRANS phrase='This plugin automatically switches the destination directory for the uploaded file by the file extension.'>",
    doc_link => 'http://labs.m-logic.jp/plugins/mt-uploaddir/docs/'.$VERSION.'/mt-uploaddir.html',
    author_name => 'M-Logic, Inc.',
    author_link => 'http://labs.m-logic.jp/',
    blog_config_template => \&template,
    l10n_class => 'UploadDir::L10N',
    settings => new MT::PluginSettings([
        ['upload_dir_enabled_default', { Default => 1, Scope => 'system' }],
        ['upload_dir_ext_list', { Default => $DEFAULT_EXT }],
        ['upload_dir_ext_default'],
    ]),
    %$plugin_registries,
});

if (MT->version_number >= 3.3) {
    MT->add_plugin($plugin);
    if (MT->version_number < 4) {
        MT->add_callback('MT::App::CMS::AppTemplateSource.upload', 9, $plugin, \&hdlr_source_upload);
    }
    if (MT->version_number >= 4) {
        # for MT4+
        MT->add_callback('MT::App::CMS::template_source.asset_upload', 9, $plugin, \&hdlr_source_asset_upload);
    }
    if (MT->version_number >= 6.2) {
        MT->add_callback('MT::App::CMS::template_source.async_asset_upload', 9, $plugin, \&hdlr_source_async_asset_upload);
        MT->add_callback('MT::App::CMS::template_param.async_asset_upload', 9, $plugin, \&hdlr_param_async_asset_upload);
        MT->add_callback('MT::App::CMS::template_param.asset_upload', 9, $plugin, \&hdlr_param_cfg_prefs);
        MT->add_callback('MT::App::CMS::template_param.cfg_prefs', 9, $plugin, \&hdlr_param_cfg_prefs);
        MT->add_callback('MT::App::CMS::cms_pre_save.blog', 9, $plugin, \&hdlr_cms_pre_save_blog);
    }
}

sub instance { $plugin; }

# MT6.2+
sub system_template {
    my $tmpl = <<'EOT';
<mtapp:setting
    id="upload_dir_enabled_default"
    label="<__trans phrase="Enable:">">
    <p><input type="checkbox" value="1" name="upload_dir_enabled_default" id="upload_dir_enabled_default"<mt:if name="upload_dir_enabled_default"> checked="checked"</mt:if> class="cb"/> <label for="upload_dir_enabled_default"><__trans phrase="Enabled this plugin by default."></label></p>
</mtapp:setting>
EOT
    $tmpl;
}

sub template {
    my $tmpl;
    if (MT->version_number >= 4) {
        $tmpl = <<'EOT';
  <mtapp:setting
     id="upload_dir_ext_list"
     label="<__trans phrase="Extensions:">">
    <p><textarea name="upload_dir_ext_list" id="upload_dir_ext_list" cols="60" rows="10"><mt:var name="upload_dir_ext_list" escape="html"></textarea></p>
  </mtapp:setting>

  <mtapp:setting
     id="upload_dir_ext_default"
     label="<__trans phrase="Default directory:">">
    <input type="text" class="med" name="upload_dir_ext_default" id="upload_dir_ext_default" value="<mt:var name="upload_dir_ext_default" escape="html">" size="60" />
  </mtapp:setting>
EOT
    }
    else {
        $tmpl = <<'EOT';
    <div class="setting">
    <div class="label">
    <label for="upload_dir_ext_list"><MT_TRANS phrase="Extensions:"></label>
    </div>
    <div class="field">
    <p><textarea name="upload_dir_ext_list" id="upload_dir_ext_list" cols="60" rows="10"><TMPL_VAR NAME=UPLOAD_DIR_EXT_LIST ESCAPE=HTML></textarea></p>
    </div> 
    </div>
    <div class="setting">
    <div class="label">
    <label for="upload_dir_ext_default"><MT_TRANS phrase="Default directory:"></label>
    </div>
    <div class="field">
    <p><input type="text" name="upload_dir_ext_default" id="upload_dir_ext_default" value="<TMPL_VAR NAME=UPLOAD_DIR_EXT_DEFAULT ESCAPE=HTML>" /></p>
    </div> 
    </div>
EOT
    }
    $tmpl;
}

sub save_config {
    my $plugin = shift;
    my ($param, $scope) = @_;
    if ($scope ne 'system') {
        my $app = MT->instance;
        unless (
            defined($plugin->build_text($app, $param->{'upload_dir_ext_list'})) && 
            defined($plugin->build_text($app, $param->{'upload_dir_ext_default'}))
        ) {
            my $msg = $plugin->translate('Error saving plugin settings: [_1]', $plugin->errstr);
            return $app->error($msg) if MT->version_number >= 4.2;
            die $msg;
        }
    }
    $plugin->SUPER::save_config($param, $scope);
}

# MT6.2+
sub enable_uploaddir {
    my ($plugin, $blog) = @_;

    my $enable = $blog->meta('enable_uploaddir');
    return 1 if $enable;
    return 0 if (!$enable && $enable eq '0');
    # default
    $plugin->get_config_value('upload_dir_enabled_default', 'system') ? 1 : 0;
}

sub upload_dir_ext_list {
    my $plugin = shift;
    my ($blog_id) = @_;
    my %plugin_param;

    $plugin->load_config(\%plugin_param, 'blog:'.$blog_id);
    my $key = $plugin_param{upload_dir_ext_list};
    unless ($key) {
        $plugin->load_config(\%plugin_param, 'system');
        $key = $plugin_param{upload_dir_ext_list};
    }
    $key;
}

sub upload_dir_ext_default {
    my $plugin = shift;
    my ($blog_id) = @_;
    my %plugin_param;

    $plugin->load_config(\%plugin_param, 'blog:'.$blog_id);
    my $key = $plugin_param{upload_dir_ext_default};
    unless ($key) {
        $plugin->load_config(\%plugin_param, 'system');
        $key = $plugin_param{upload_dir_ext_default};
    }
    $key;
}

sub build_text {
    my ($plugin, $app, $text) = @_;

    return '' unless $text;

    my $blog = $app->blog;
    my $author = $app->user;

    require MT::Template;
    require MT::Template::Context;
    my $tmpl = MT::Template->new;
    $tmpl->name('UploadDir Configuration');
    $tmpl->text($text);
    my $result = '';
    my $ctx = MT::Template::Context->new;
    $ctx->stash('author', $author);
    $ctx->stash('blog', $blog);
    $ctx->stash('blog_id', $blog->id);
    $tmpl->blog_id($blog->id);
    $result = $tmpl->build($ctx)
        or return $plugin->error($tmpl->errstr);
    $result;
}

sub parse_ext {
    my $plugin = shift;
    my $ext_list = shift;

    $ext_list =~ s/,/\|/g;

    my @lines = split(/\n/, $ext_list);

    my %ext = ();
    foreach my $line (@lines) {
        $line =~ s/[\r\n]//g;
        last if !$line;
        $line =~ m/([^:]+):(.+)$/;
        $ext{$2} = $1;
    }

    %ext;
}

sub make_script {
    my $app = shift;
    my $blog = $app->blog;
    my $blog_id = $blog->id;

    my $ext_list = $plugin->build_text($app, $plugin->upload_dir_ext_list($blog_id));
    my $ext_default = $plugin->build_text($app, $plugin->upload_dir_ext_default($blog_id));

    my %ext = $plugin->parse_ext($ext_list);

    my $ext_if;
    foreach my $key ( keys %ext ) {
        $ext_if .= 'if (fln.match(/\.(' . $key . ')$/i)){' . "\n";
        $ext_if .= '    el.value = \'' . $ext{$key} . "'\n";
        $ext_if .= '} else '
    }
    $ext_if .= "{ \n";
    $ext_if .= "    el.value = '" . $ext_default . "';\n";
    $ext_if .= "}\n";

    my $script = <<"HTML";
<script type="text/javascript" language="JavaScript">
<!--
function changePath(fl){
var fln = fl.value;
var el = document.getElementById('extra_path');

$ext_if
}
//-->
</script>
HTML

    $script;
}

# MT6.2+
sub make_setting_tmpl {
    my ($app, $nofield) = @_;
    my $blog = $app->blog;
    my $blog_id = $blog->id;
    my $enable = $plugin->enable_uploaddir($blog);
    my $label = $plugin->translate('Determined by extensions');
    my $display = $plugin->translate('Show configuration');
    my $hide = $plugin->translate('Hide configuration');
    my $ext_list = $plugin->build_text($app, $plugin->upload_dir_ext_list($blog_id));
    my $ext_default = $plugin->build_text($app, $plugin->upload_dir_ext_default($blog_id));
    my %ext = $plugin->parse_ext($ext_list);
    my $field = $nofield ? <<"HTML":
&nbsp;<span>($label <a href="javascript:void(0)" class="toggle_uploaddir">$display</a>)</span>
HTML
<<"HTML";
<input type="checkbox" name="enable_uploaddir" id="enable_uploaddir" value="1" class="cb" />
<label for="enable_uploaddir">$label</label>
&nbsp;<span>(<a href="javascript:void(0)" class="toggle_uploaddir">$display</a>)</span>
HTML
    my $initjs = <<"HTML";
jQuery(function() {
  jQuery('#enable_uploaddir').prop('checked', true);
  jQuery('#extra_path').addClass('disabled').attr('disabled', 'disabled');
});
HTML
    my $js = $nofield ? '' : <<"HTML";
jQuery('#enable_uploaddir').change( function() {
  if (jQuery(this).prop('checked')) {
    jQuery('#extra_path').addClass('disabled').attr('disabled', 'disabled');
  }
  else {
    jQuery('#extra_path').removeClass('disabled').removeAttr('disabled');
  }
});
HTML
    $js .= $initjs if $enable;
    my $table = '<thead>';
    $table .= '<tr><th class="dir">' . $plugin->translate('Directory') . '</th><th class="ext">' . $plugin->translate('Extensions') . "</th></tr>\n";
    foreach my $key ( keys %ext ) {
        $table .= '<tr><td class="dir">' . MT::Util::encode_html($ext{$key}) . '</td>';
        $key =~ s/\|/, /g;
        $table .= '<td class="ext">' . MT::Util::encode_html($key) . "</td></tr>\n";
    }
    $table .= '<tr><td class="dir default">' . MT::Util::encode_html($ext_default) . '</td><td class="ext default">' . $plugin->translate('Default') . "</td></tr>\n";
    $table .= "</tbody>\n";
    my $script = <<"HTML";
<div style="display:inline-block;vertical-align: baseline;">
$field
<style>
#uploaddir_extlist {
    display: block;
    border-radius: 3px;
    border: 1px solid #c0c6c9;
    border-collapse: collapse;
    margin-bottom: 0;
}
#uploaddir_extlist th {
    text-align: left;
    background-color: #e6e6e6;
    border-bottom: 1px solid #c0c6c9;
}
#uploaddir_extlist th,
#uploaddir_extlist td {
    margin: 0;
    padding: 3px;
}
#uploaddir_extlist .dir {
    border-right: 1px solid #c0c6c9;
}
#uploaddir_extlist .default {
    border-top: 1px dotted #c0c6c9;
}
</style>
<table id="uploaddir_extlist" class="hidden">
$table
</table>
</div>
<mt:setvarblock name="jq_js_include" append="1">
$js
jQuery('.toggle_uploaddir').click(function() {
  var list=jQuery('#uploaddir_extlist');
  if (list.hasClass('hidden')) {
    jQuery(this).text('$hide');
    list.removeClass('hidden');
  }
  else {
    jQuery(this).text('$display');
    list.addClass('hidden');
  }
  return false;
});
</mt:setvarblock>
HTML

    $script;
}

sub hdlr_source_upload {
    my ($eh, $app, $tmpl_ref) = @_;
    if (MT->version_number < 3.4) {
        # hdlr_source_3_3(@_);
        my $old = <<'HTML';
<p><label for="file"><MT_TRANS phrase="File:"></label> <input type="file" name="file" /></p>
HTML
        my $script = make_script($app);
        my $new = <<"HTML";
$script

<p><label for="file"><MT_TRANS phrase="File:"></label> <input type="file" name="file" onchange="changePath(this)" /></p>
HTML
        $$tmpl_ref =~ s!$old!$new!;
    } else {
        # hdlr_source_w(@_);
        my $old = <<'HTML';
<p><input type="file" name="file" /></p>
HTML
        my $script = make_script($app);
        my $new = <<"HTML";
$script

<p><input type="file" name="file" onchange="changePath(this)" /></p>
HTML
       $$tmpl_ref =~ s!$old!$new!;
    }
    1;
}

sub hdlr_source_asset_upload {
    my ($eh, $app, $tmpl_ref) = @_;
    if (MT->version_number < 4.2) {
        # MT4
        my $old = <<'HTML';
<input type="file" name="file" />
HTML
        my $script = make_script($app);
        my $new = <<"HTML";
$script

<input type="file" name="file" onchange="changePath(this)" />
HTML
        $$tmpl_ref =~ s!$old!$new!;
    } else {
        # MT4.2+
        my $old = <<'HTML';
<input type="file" name="file" id="file" />
HTML
        my $script = make_script($app);
        my $new = <<"HTML";
$script

<input type="file" name="file" id="file" onchange="changePath(this)" />
HTML
        $$tmpl_ref =~ s!$old!$new!;
    }
    1;
}

# MT6.2+
sub hdlr_source_async_asset_upload {
    my ($eh, $app, $tmpl_ref) = @_;
    my $blog = $app->blog;
    my $blog_id = $blog->id;
    my $enable = $plugin->enable_uploaddir($blog);
    my $old = quotemeta('<input type="hidden" id="extra_path" name="extra_path" value="<mt:var name="extra_path" escape="html">" />');
    my $new = <<"HTML";
<input type="hidden" id="enable_uploaddir" name="enable_uploaddir" value="$enable" />
HTML
    $$tmpl_ref =~ s!($old)!$1\n$new!;
    my $label = $enable ? ' ' . make_setting_tmpl($app, 1) : '<mt:var name="extra_path" escape="html" />';
    $old = quotemeta('<mt:var name="upload_destination_label"') . '[^\>]*?' . quotemeta('>/<mt:var name="extra_path"') . '[^\>]*?\>';
    $new = <<"HTML";
<mt:var name="upload_destination_label" escape="html" />/$label
HTML
    $$tmpl_ref =~ s!$old!$new!;

    my $ext_list = $plugin->build_text($app, $plugin->upload_dir_ext_list($blog_id));
    my $ext_default = $plugin->build_text($app, $plugin->upload_dir_ext_default($blog_id));
    my %ext = $plugin->parse_ext($ext_list);
    my $ext_if = '';
    foreach my $key ( keys %ext ) {
        $ext_if .= 'if (fl.match(/\.(' . $key . ')$/i)){' . "\n";
        $ext_if .= '    dn = \'' . $ext{$key} . "';\n";
        $ext_if .= '} else '
    }
    $ext_if .= "{ \n";
    $ext_if .= "    dn = '" . $ext_default . "';\n";
    $ext_if .= "}\n";
    $new = <<"HTML";
if (jQuery('input:checkbox#enable_uploaddir').prop('checked') || jQuery('input:hidden#enable_uploaddir').val() == 1 ) {
var fl = file.name;
var dn = '';
$ext_if
fd.append('extra_path', dn );
}
else {
    fd.append('extra_path', jQuery('#extra_path').val() );
}
HTML
    if ((MT->version_number == 6.3 && MT->release_number < 5) || MT->version_number < 6.3) {
        $old = quotemeta('fd.append(\'extra_path\', jQuery(\'#extra_path\').val() );');
        $$tmpl_ref =~ s!$old!$new!;
    }
    else {
        # > 6.3.5
        $old = quotemeta('fd.append(\'magic_token\', \'<mt:var name="magic_token">\');');
        $$tmpl_ref =~ s!($old)!$1\n$new!;
        $old = quotemeta('|| $fld.name === \'destination\'');
        $new = '|| $fld.name == \'extra_path\'';
        $$tmpl_ref =~ s!($old)!$1$new!;
    }
    1;
}

# MT6.2+
sub hdlr_param_async_asset_upload {
    my ( $cb, $app, $param, $tmpl ) = @_;
    my $blog = $app->blog;
    my $blog_id = $blog->id;
    my $setting = make_setting_tmpl($app);
    my @dest_loop_nodes = grep { $_->getAttribute('name') eq 'destination_loop' } @{ $tmpl->getElementsByTagName('if') };
    if (@dest_loop_nodes) {
        my $uploaddir_node = $tmpl->createTextNode($setting);
        $tmpl->insertAfter( $uploaddir_node, $dest_loop_nodes[0] );
        my $html = $dest_loop_nodes[0]->innerHTML();
        if ($html =~ /upload\-extra\-path/) { # for 6.2.2
            my $old = quotemeta('<input type="text" name="extra_path"');
            $html =~ s!/ ($old)!$1!;
            $old = quotemeta('<span class="upload-extra-path"');
            $html =~ s!($old)!\/ $1!;
            $dest_loop_nodes[0]->innerHTML($html);
        }
    }
}

# MT6.2+
sub hdlr_param_cfg_prefs {
    my ( $cb, $app, $param, $tmpl ) = @_;
    my $blog = $app->blog || return;
    $param->{enable_uploaddir} = $plugin->enable_uploaddir($blog);
    my $setting = make_setting_tmpl($app);
    my $dest_node = $tmpl->getElementById('upload_destination') or return;
    my $html = $dest_node->innerHTML();
    my $old = quotemeta('<div class="option"');
    $html =~ s!($old)!$setting\n$1!;
    if ($html =~ /upload\-extra\-path/) { # for 6.2.2
        $old = quotemeta('<input type="text" name="extra_path"');
        $html =~ s!/ ($old)!$1!;
        $old = quotemeta('<span class="upload-extra-path"');
        $html =~ s!($old)!\/ $1!;
    }
    $dest_node->innerHTML($html);
}

# MT6.2+
sub hdlr_cms_pre_save_blog {
    my ($cb, $app, $obj, $original) = @_;
    my $enabled = $app->param('enable_uploaddir');
    $obj->enable_uploaddir($enabled ? 1 : 0);
    return 1;
}

1;
