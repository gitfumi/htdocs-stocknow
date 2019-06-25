package CSVDataImExporter::Export;

use strict;

use MT;
use MT::I18N qw( const encode_text );

use MT::Util qw( dirify );
use MT::Author;

use Encode;
use Data::Dumper;

my $category_separator;

sub export_entries_with_csv {
    my $app = shift;
    if ($app->param('_type') eq 'entry') {
        $app->param('export_class', 'entry');
    } else {
        $app->param('export_class', 'page');
    }
    do_excel_export( $app );
}

sub start_export_with_excel {
    my $app = shift;

    return $app->permission_denied()
        if !$app->can_do('open_blog_export_screen');

    my %param;
    my $q = $app->param;
    my $blog_id = $q->param('blog_id');

#    $param{encoding_names} = const('ENCODING_NAMES');

    if ($blog_id) {
        $param{blog_id} = $blog_id;
        my $blog = $app->model('blog')->load($blog_id)
            or return $app->error($app->translate('Can\'t load blog #[_1].', $blog_id));
        $param{text_filters} = $app->load_text_filters( $blog->convert_paras );
    }

    $param{ export_class } = $q->param('export_class');
    $param{ page_title } = MT->translate('Export Excel Data');

    my $plugin = MT->component("CSVDataImExporter");
    my $imexport_character = $plugin->get_config_value('imexport_character', 'blog:' . $blog_id);
    if ( $imexport_character eq 'system' ) {
        $imexport_character = $plugin->get_config_value('imexport_character_system', 'system') || 0;
    }
    $param{imexport_character} = $plugin->translate( $imexport_character );

    my $tmpl = 'export_excel.tmpl';
    return $app->build_page($tmpl, \%param);
}

sub do_excel_export {
    my $app = shift;
    my $charset = $app->charset;

    my $perms = $app->permissions;
#    return $app->error(
#        $app->translate("You do not have export permissions") )
#        unless $perms && $perms->can_do('export_blog');
    $app->validate_magic() or return;

    require MT::Blog;
    my $blog_id = $app->param('blog_id')
      or return $app->error( $app->translate("Please select a blog.") );
    my $blog = MT::Blog->load($blog_id)
      or return $app->error(
        $app->translate(
            "Load of blog '[_1]' failed: [_2]",
            $blog_id, MT::Blog->errstr
        )
      );

    my $plugin = MT->component("CSVDataImExporter");
    $category_separator = $plugin->get_config_value('category_separator', 'blog:'.$blog_id) || ':';

    my @ts = localtime(time);
    my $file = sprintf "export-%03d-", $app->param('blog_id');
    $file .= sprintf "%04d%02d%02d%02d%02d%02d", $ts[5] + 1900, $ts[4] + 1, @ts[ 3, 2, 1, 0 ];

    my $ext = '.csv';
    $file = $file . $ext;

    $app->{no_print_body} = 1;
    local $| = 1;

    $app->set_header( "Content-Disposition" => "attachment; filename=$file" );
    $app->send_http_header(
        $charset
        ? "text/plain; charset=$charset"
        : 'text/plain'
    );

    require CSVDataImExporter::ImportExport;
    CSVDataImExporter::ImportExport->export( $app, $blog, sub { $app->print(@_) } )
        or return $app->error( CSVDataImExporter::ImportExport->errstr );
    1;
}

1;
