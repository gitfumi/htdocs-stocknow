package CSVDataImExporter::ImportExport;
use strict;

use base qw(MT::ErrorHandler);

use Encode;
use MT::I18N qw( encode_text guess_encoding );
use MT::Placement;
use MT::ImportExport;

my $separator = ',';
my $category_separator = '--';

my $same_data = {
    1 => 'basename',
    2 => 'title'
};

sub get_param {
    my ($blog_id) = shift;
    my $blog = MT::Blog->load($blog_id)
        or return;

    my $param;
    my $plugin = MT->component("CSVDataImExporter");
    my $imexport_character = get_imexport_character( $plugin, $blog_id );
    $param->{imexport_character} = $plugin->translate( $imexport_character );
    $param;
}

sub get_imexport_character {
    my $plugin = shift;
    my $blog_id = shift;
    my $imexport_character = $plugin->get_config_value('imexport_character', 'blog:' . $blog_id);
    if ( $imexport_character eq 'system' ) {
        $imexport_character = $plugin->get_config_value('imexport_character_system', 'system') || 0;
    }
    return $imexport_character;
}

sub import_contents {
    my $class = shift;
    my %param = @_;

    ## Init error buffer.
    __PACKAGE__->error();
    my $iter = $param{Iter};
    my $blog = $param{Blog}
        or return __PACKAGE__->error( MT->translate("No Blog") );
    my $cb = $param{Callback} || sub { };
    my $encoding = $param{Encoding};

    my $blog_id = $blog->id;

    my $import_result = eval {
        while ( my $stream = $iter->() ) {
            my $result = eval { $class->start_csv_import( $stream, %param ); };
            $cb->($@) unless $result;
        }
        $class->errstr ? undef : 1;
    };

    $import_result;
}

sub start_csv_import {
    my $class = shift;
    my ( $stream, %param ) = @_;

my $app = MT->instance;

my $blog_id = $param{Blog}->id;

    my $plugin = MT->component("CSVDataImExporter");
    my $imexport_character = get_imexport_character( $plugin, $blog_id );
    my $is_cloud = $plugin->get_config_value('is_cloud', 'system') || 0;

my $req = MT::Request->instance() unless $is_cloud;

    my $buf;
    my @file;
    my $counter = 0;
    foreach my $tmp (<$stream>) {
        $tmp = encode_text($tmp, $imexport_character, 'utf-8');
        $buf .= $tmp;
        next if ($buf =~ s/"/"/g) % 2;
        chomp $buf;
        $buf =~ s/^\xef\xbb\xbf// unless $counter;
        push( @file, $buf );
        $buf = "";
        $counter++;
    }

    my @customfields;
    my $meta;
    my $header = 0;
    my %flag;
    my %pos;

    my @values = _get_data(shift(@file), $separator);
    $values[$#values] =~ s/\\//;

#    my $plugin = MT->component("CSVDataImExporter");

    my $error = 0;
    my $warning = 0;
    my $counter = 2;
    $param{Callback}->( $plugin->translate('The check of the number of CSV columns is started...') . "\n" );

    foreach my $tmp (@file) {
        my @data = _get_data($tmp, $separator);
        if ($#data != $#values) {
            $param{Callback}->( '*** ' . $counter . $plugin->translate('The number of items of CSV data([_1]) does not suit the number of items of a header([_2]). This error is outputted also when there is no data in the last column.', $#data, $#values) . "\n" );
        }
        for my $i (0 .. $#data) {
#            $error |= _check( $values[$i], $data[$i], $counter, $param{Callback} );
        }
        $counter++;
    }
    if ($error) {
        $param{Callback}->( $plugin->translate('Import is stopped because CSV data has an error.') . "\n" );
        return $class->error( $plugin->translate('Import is stopped because CSV data has an error.') );
    }
    $param{Callback}->( $plugin->translate('The check of CSV data was completed normally.') . "\n" );

    $param{Callback}->( $plugin->translate('Import of CSV data is started...') . "\n" );

    foreach my $tmp (@file) {
        my @data = _get_data($tmp, $separator);
        $data[$#data] =~ s/\\$//;

        # get data
        my $buf = '';
        my @categories;
        my @assets;
        my $fieldcount = 0;

        my $entry;
        my $class;
        my $class_type;
        my $author_name;
        my $col;
        my $new = 0;
        my $skip = 0;
        my @asset_ids;

        # for cf_image
        my $cf_assets;
        my $cf_asset_basename;

        for my $i (0 .. $#data) {
            if ($values[$i] eq 'class') {
                $class = $data[$i] eq 'entry' ? $app->model('entry') : $app->model('page');
                next;
            }

            if ($values[$i] eq 'id') {
                if (!$data[$i]) {
                    if ($param{null_id_process}) {
                        my $same = $same_data->{$param{null_id_process}};
                        for my $j (0 .. $#data) {
                            if ($values[$j] eq $same) {
                                $entry = $class->load( { blog_id => $blog_id, $same => $data[$j] } );
                                if (!$entry) {
                                    $entry = $class->new;
                                    $new = 1;
                                }
                                last;
                            }
                        }
                    } else {
                        $entry = $class->new;
                        $new = 1;
                    }
                } else {
                    $entry = $class->load( { blog_id => $blog_id, id => $data[$i] } );
                    if (!$entry) {
                        if (!$param{no_id_process}) {
                            $param{Callback}->( "ID:$data[$i] " . $plugin->translate('Processing is skipped because there is no applicable entry.') . "\n" );
                            $skip = 1;
                            last;
                        } else {
                            $entry = $class->new;
                            $new = 1;
                        }
                    } else {
                        if ($param{same_id_process}) {
                            my $id = $entry->id;
                            $param{Callback}->( "ID:$data[$i] " . $plugin->translate('Update is skipped because there is applicable entry.') . "\n" );
                            $skip = 1;
                            last;
                        }
                    }
                }
                $class_type = $entry->class;
                next;
            }

            if ($values[$i] eq 'title' ||
                $values[$i] eq 'status' ||
                $values[$i] eq 'text' ||
                $values[$i] eq 'text_more' ||
                $values[$i] eq 'excerpt' ||
                $values[$i] eq 'keywords' ||
                $values[$i] eq 'allow_comments' ||
                $values[$i] eq 'allow_pings' ||
                $values[$i] eq 'basename') {

                $data[$i] = 1 if ($values[$i] eq 'status' && !$data[$i]);
                $data[$i] = 1 if ($values[$i] eq 'allow_comments' && !$data[$i]);
                $data[$i] = 1 if ($values[$i] eq 'allow_pings' && !$data[$i]);

                $col = $values[$i];
                if ($data[$i]) {
                    $entry->$col($data[$i]);
                }
                next;

            } elsif ($values[$i] eq 'convert_breaks') {
                $entry->convert_breaks( scalar $data[$i] );
                next;

            } elsif ($values[$i] eq 'author') {
                $author_name = $data[$i];
                next;
            } elsif ($values[$i] eq 'authored_on') {
                $entry->authored_on(_convert_date($data[$i]));
                next;
            } elsif ($values[$i] eq 'modified_on') { # Only update
                $entry->modified_on(_convert_date($data[$i])) if !$new;
                next;
            } elsif ($values[$i] eq 'unpublished_on') { # Only update
                if ( $data[$i] ) {
                    $entry->unpublished_on(_convert_date($data[$i]));
                } else {
                    $entry->unpublished_on( undef );
                }
                next;
            } elsif ($values[$i] eq 'tags') {
                if ($data[$i]) {
                    my @tags = split(/,/, $data[$i]);
                    $entry->remove_tags();
                    $entry->tags(@tags);
                }
                next;
            } elsif ($values[$i] eq 'categories') {
                if ($data[$i]) {
                    @categories = split(/,/, $data[$i]);
                }
                next;
            } elsif ($values[$i] eq 'assets') {
                if ($data[$i]) {
                    @assets = split(/,/, $data[$i]);
                }
                next;
            } else {

                my $field_basename = $values[$i];
                my $val = $data[$i];

                my $field;
                if ($is_cloud) {
                    $field = MT->model('field')->load(
                        {   basename => $field_basename,
                            blog_id  => [ 0, $blog_id ]
                        }
                    );
                } else {
                    $field = $req->cache( $field_basename . $blog_id );
                    unless ($field) {
                        $field = MT->model('field')->load(
                            {   basename => $field_basename,
                                blog_id  => [ 0, $blog_id ]
                            }
                        );
                        $req->cache( $field_basename . $blog_id, $field )
                            if $field;
                    }
                }

                my $field_name = 'field.' . $field_basename;
                next unless $entry->has_meta($field_name);
                if ( $field->type eq 'datetime' ) {
                    if ( $val ) {
                        $val = _convert_date($val);
                    } else {
                        undef $val;
                    }
                } else {
                    if ($field->type eq 'file' || 
                        $field->type eq 'image' ||
                        $field->type eq 'audio' ||
                        $field->type eq 'video') {
                        (my $asset_id = $val) =~ s/.*asset-id="(\d+)".*/$1/;

                        if ($asset_id =~ /^\d+$/) {
                            push(@asset_ids, $asset_id);
                        } else {

                            # for cf_image
                            $cf_assets->{$field_basename}->{data} = $val;
                            $cf_assets->{$field_basename}->{type} = $field->type;
                        }
                    }
                }
                $entry->$field_name($val);
            }
        }

        unless ($skip) {

            # new entry
            if ($new) {
#                my $author = MT::Author->load( { name => $author_name } );

                my $author;
                if ($is_cloud) {
                    $author = MT->model('author')->load(
                        { name => $author_name }
                    );
                } else {
                    $author = $req->cache( "author" . $author_name );
                    unless ($author) {
                        $author = MT->model('author')->load(
                            { name => $author_name }
                        );
                        $req->cache("author" . $author_name, $author )
                            if $author;
                    }
                }

                unless ($author) {
                    $param{Callback}->( $plugin->translate('Import is stopped because the user([_1]) is not registered.', $author_name) . "\n" );
                    return $class->error( $plugin->translate('Import is stopped because the user([_1]) is not registered.', $author_name) );
                }
                $entry->author_id($author->id);

                my $blog;
                if ($is_cloud) {
                    $blog = MT->model('blog')->load(
                        { id => $blog_id }
                    );
                } else {
                    $blog = $req->cache( "blog" . $blog_id );
                    unless ($blog) {
                        $blog = MT->model('blog')->load(
                            { id => $blog_id }
                        );
                        $req->cache("blog" . $blog_id, $blog )
                            if $blog;
                    }
                }

                unless ($blog) {
                    $param{Callback}->( $plugin->translate('Import is stopped because blog_id([_1]) is not registered.', $blog_id ) . "\n" );
                    return $class->error( $plugin->translate('Import is stopped because blog_id([_1]) is not registered.', $blog_id ) );
                }
                $entry->blog_id( $blog_id );
            } else {
                my $author = MT::Author->load( { name => $author_name } );
                if ($author) {
                    $entry->author_id($author->id);
                }
            }

            # for cf_image
            if ( $cf_assets ) {
                for my $cf_asset ( keys %{$cf_assets} ) {
                    my ( $asset_id, $url ) = _add_cf_asset_to_entry($blog_id, $entry->id, $cf_assets->{$cf_asset}->{data}, $param{Callback});
                    next if !$asset_id;
                    my $form;
                    my $asset = MT->model('asset')->load($asset_id);
                    my $filename = $asset->file_name;
                    if ( $cf_assets->{$cf_asset}->{type} eq 'image' ) {
                        my $message = $plugin->translate('display');
                        $form = qq{<form mt:asset-id="$asset_id" class="mt-enclosure mt-enclosure-image" style="display: inline;"><a href="$url">$message</a></form>};
                    } elsif ( $cf_assets->{$cf_asset}->{type} eq 'audio' ) {
                        $form = qq{<form mt:asset-id="$asset_id" class="mt-enclosure mt-enclosure-audio" style="display: inline;"><a href="$url">$filename</a></form>};
                    } elsif ( $cf_assets->{$cf_asset}->{type} eq 'video' ) {
                        $form = qq{<form mt:asset-id="$asset_id" class="mt-enclosure mt-enclosure-video" style="display: inline;"><a href="$url">$filename</a></form>};
                    } else {
                        $form = qq{<form mt:asset-id="$asset_id" class="mt-enclosure mt-enclosure-image" style="display: inline;"><a href="$url">$filename</a></form>};
                    }
                    my $field_name = 'field.' . $cf_asset;
                    $entry->$field_name($form);
                    $param{Callback}->( $plugin->translate('Entry([_1]) and CF Asset([_2]) are associated.', $entry->id, $asset_id) . '<br />' );
                }
            }

            $entry->save or $param{Callback}->( $entry->errstr . "\n" ); #die $entry->errstr;

            my $type = $entry->class eq 'entry' ? MT->translate('Entry') : MT->translate('Page');
            if ($new) {
                 $param{Callback}->( $plugin->translate('Added [_1](ID:[_2])', $type, $entry->id) . "\n" );
            } else {
                 $param{Callback}->( $plugin->translate('Updated [_1](ID:[_2])', $type, $entry->id) . "\n" );
            }
            my $result = _add_category_to_entry( $app, $req, \%param, $entry->id, \@categories, $class_type, $param{Callback} );
            $result = _add_asset_to_entry( $blog_id, $entry->id, \@assets, $param{Callback} );
        }
        undef $entry;
    }
    1;
}

sub _create_category {
    my ($blog_id, $category_label, $category_basename, $parent_category_id, $class_type) = @_;

    my $category_class = MT->model($class_type eq 'entry' ? 'category' : 'folder');

    my $cat = $category_class->new;
    $cat->blog_id($blog_id);
    $cat->label($category_label);
    $cat->basename($category_basename) if $category_basename;
    $cat->parent($parent_category_id);
    $cat->save
      or die $cat->errstr;
    my $cat_id = $cat->id;

    require MT::Blog;
    my $blog = MT::Blog->load($blog_id)
        or return;
    my $meta = $class_type eq 'entry' ? 'category_order' : 'folder_order';
    my @order = split ',', ( $blog->meta( $meta ) || '' );
    unshift @order, $cat->id;
    my $new_order = join ',', @order;
    $blog->meta( $meta, $new_order );
    $blog->save;    # Ignore error.

    undef $cat;

    return $cat_id;
}

sub _add_category_to_entry {
    my ($app, $req, $param, $entry_id, $categories, $class_type, $cb) = @_;

    my $blog_id = $param->{Blog}->id;
    my $category_class = MT->model($class_type eq 'entry' ? 'category' : 'folder');

    # collect current placement
    my $placements = ();
    my @list = MT::Placement->load({ blog_id => $blog_id, entry_id => $entry_id });
    foreach my $obj_asset (@list) {
        my $category_id = $obj_asset->category_id;
        $placements->{$category_id} = 1;
    }
undef @list;

    my $is_primary;
    my $cat;
    my $cat_id;
    my $count = 0;
    my $seen = ();

    my $plugin = MT->component("CSVDataImExporter");

    for my $category_tmp (@{$categories}) {
        my @category_list = ();
        if ($category_tmp =~ /$category_separator/) {
           @category_list = split($category_separator, $category_tmp);
        } else {
           push(@category_list, $category_tmp);
        }
        my $category_count = 0;
        my $parent_categories;
        my $parent_category_id = 0;

        my $message_class = $class_type eq 'entry' ? MT->translate('Category') : MT->translate('Folder');
        for my $category_label (@category_list) {

            my $create = 0;
            my $category_id = '';

            my $category_basename = '';
            if ($category_label =~ /(.*)\((\d+):(.*)\)/) {
                $category_label = $1;
                $category_id = $2;
                $category_basename = $3;

                if($app->param('no_id_process')){
                    $create = 1;
                }
            } elsif ($category_label =~ /(.*)\((\d+)\)/) {
                $category_label = $1;
                $category_id = $2;

                if($app->param('no_id_process')){
                    $create = 1;
                }
            } elsif ($category_label =~ /(.*)\(\:(.*)\)/) {
                $category_label = $1;
                $category_basename = $2;
                $create = 1;
            } elsif ($category_label =~ /(.*)/) {
                $category_label = $1;
                $create = 1;
            }
#            $cat = $req->cache( "cat" . $category_id . $blog_id );

            if (!$create) {
                if (!$category_count) {
                    $cat = $category_class->load({ id => $category_id, blog_id => $blog_id });
                } else {
                    $cat = $category_class->load( { id => $category_id, parent => $parent_category_id, blog_id => $blog_id } );
                }
            }

            if ($create) {
                if ($category_basename) {
                    if ($category_count) {
                        $cat = $category_class->load({ label => $category_label, basename => $category_basename, parent => $parent_category_id, blog_id => $blog_id });
                    } else {
                        $cat = $category_class->load({ label => $category_label, basename => $category_basename, blog_id => $blog_id });
                    }
                } else {
                    if ($category_count) {
                        $cat = $category_class->load({ label => $category_label, parent => $parent_category_id, blog_id => $blog_id });
                    } else {
                        $cat = $category_class->load({ label => $category_label, blog_id => $blog_id });
                    }
                }
                $create = 0 if $cat;
            }

            # カテゴリ作成
            if(!$cat) {
                $category_id = _create_category($blog_id, $category_label, $category_basename, $parent_category_id, $class_type);
                if (!$create) {
                    if ($category_count) {
                        $cb->( $plugin->translate('sub [_1]([_2]) is created.', $message_class , Encode::decode_utf8($category_label)) . "\n" );
                    } else {
                        $cb->( $plugin->translate('\[_1]([_2]) is created.', $message_class , Encode::decode_utf8($category_label)) . "\n" );
                    }
                } else {
                    if ($category_count) {
                        $cb->( $plugin->translate('sub [_1]([_2]) is created.', $message_class , Encode::decode_utf8($category_label)) . "\n" );
                    } else {
                        $cb->( $plugin->translate('\[_1]([_2]) is created.', $message_class , Encode::decode_utf8($category_label)) . "\n" );
                    }
                }
            } else {
                $category_id = $cat->id;
            }

            if (!$category_count) {
                $parent_categories = $category_label;
#                $cb->( $plugin->translate('set category [_1]', $category_label) . "\n" ) if $category_id;
            } else {
                $parent_categories .= '->'.$category_label;
#                $cb->( $plugin->translate('set subcategory [_1] parent category[_2]', $category_label, $parent_categories) . "\n" ) if $category_id;
            }

            # 最下層のサブカテゴリの場合
            if ($category_count == $#category_list) {
                my $place = MT::Placement->load( { entry_id => $entry_id, category_id => $category_id } );
                unless ($place) {
                    use MT::Placement;
                    my $place = MT::Placement->new;
                    $place->entry_id($entry_id);
                    $place->blog_id($blog_id);
                    $place->category_id($category_id);
                    $is_primary = $category_count == $count ? 1 : 0;
                    $is_primary = 1 if $class_type eq 'page'; # for folder
                    $place->is_primary($is_primary);
                    $place->save
                        or die $place->errstr;
                    $cb->( $plugin->translate('Entry([_1]) and [_2]([_3]) are associated.', $entry_id, $message_class, Encode::decode_utf8($parent_categories)) . "\n" );
                } else {
                    $cb->( $plugin->translate('Association of Entry([_1]) and [_2]([_3]) is skipped.', $entry_id, $message_class, $category_id) . "\n" );
                }
                $seen->{$category_id} = 1;
undef $place;
            }
            $parent_category_id = $category_id;
            $count++;
            $category_count++;
undef $cat;
        }
    }

    # clean placement
    foreach my $category_id (keys %{$placements}) {
        unless ($seen->{$category_id}) {
            my $placement = MT::Placement->load({ category_id => $category_id, entry_id => $entry_id });
            $placement->remove;
            $cb->( $plugin->translate('Association of Entry([_1]) and Catgory([_2]) is canceled.', $entry_id, $category_id) . "\n" );
undef $placement;
        }
    }

    return 1;
}

sub _add_asset_to_entry {
    my ($blog_id, $id, $assets, $cb) = @_; # no nessesary class_type

    my $plugin = MT->component("CSVDataImExporter");

    my $obj_assets = ();
    my @obj_assets = MT::ObjectAsset->load({ object_ds => 'entry', object_id => $id });
    foreach my $obj_asset (@obj_assets) {
        my $asset_id = $obj_asset->asset_id;
        $obj_assets->{$asset_id} = 1;
    }
    my $seen = ();
    foreach my $asset_id (@{$assets}) {
        if ($asset_id =~ /.*\((\d+)\)/) {
            $asset_id = $1;
        } else {
            $asset_id = upload($blog_id, $asset_id, $cb);
            next if !$asset_id;
        }
        my $obj_asset = MT::ObjectAsset->load({ asset_id => $asset_id, object_ds => 'entry', object_id => $id });
        unless ($obj_asset) {
            my $obj_asset = new MT::ObjectAsset;
            $obj_asset->blog_id($blog_id);
            $obj_asset->asset_id($asset_id);
            $obj_asset->object_ds('entry');
            $obj_asset->object_id($id);
            $obj_asset->save;
#            $cb->( $plugin->translate('Entry([_1]) and Asset([_2]) are associated.', $id, $asset_id) . "\n" );
        } else {
#            $cb->( $plugin->translate('Association of Entry([_1]) and Asset([_2]) is skipped.', $id, $asset_id) . "\n" );
        }
        $seen->{$asset_id} = 1;
undef $obj_asset;
    }
    foreach my $asset_id (keys %{$obj_assets}) {
        unless ($seen->{$asset_id}) {
            my $obj_asset = MT::ObjectAsset->load({ asset_id => $asset_id, object_ds => 'entry', object_id => $id });
            $obj_asset->remove;
undef $obj_asset;
        }
    }
    return 1;
}

# for cf_image
sub _add_cf_asset_to_entry {
    my ($blog_id, $id, $path, $cb) = @_; # no nessesary class_type

    my $plugin = MT->component("CSVDataImExporter");

    my $asset_id = upload($blog_id, $path, $cb);
    return ( 0, '' ) if !$asset_id;

    my $obj_asset = MT::ObjectAsset->load({ asset_id => $asset_id, object_ds => 'entry', object_id => $id });
    unless ($obj_asset) {
        my $obj_asset = new MT::ObjectAsset;
        $obj_asset->blog_id($blog_id);
        $obj_asset->asset_id($asset_id);
        $obj_asset->object_ds('entry');
        $obj_asset->object_id($id);
        $obj_asset->save;
        $cb->( $plugin->translate('Entry([_1]) and Asset([_2]) are associated.', $id, $asset_id) . "\n" );
    } else {
        $cb->( $plugin->translate('Association of Entry([_1]) and Asset([_2]) is skipped.', $id, $asset_id) . "\n" );
    }
    my $asset = MT::Asset->load( $asset_id );
    return ( $asset_id, $asset->url );
}

sub upload {
    my ($blog_id, $file_path, $cb) = @_;

    return 0 if !$file_path;

    my $plugin = MT->component("CSVDataImExporter");

    my $obj = MT->model('asset')->new();
    $obj->blog_id( $blog_id );

    $file_path =~ s/\\/\//g;
    ( my $file_name = $file_path ) =~ s/^.*\/([^\/]+)$/$1/;

    $obj->file_name( $file_name );
    $obj->file_path( '%r/assets/' . $file_name );
    $obj->url( '%r/assets/' . $file_name );
    $obj->label( $file_name );

    ( my $ext = $file_path ) =~ s/^.*\.([^.]+)$/$1/;

    $obj->file_ext( $ext );

    if ( $ext =~ /jpg|gif|jpe|jpeg|png|bmp|tif|tiff|ico/i) {
        $obj->class('image');
    } elsif ( $ext =~ /mp3|ogg|aif|aiff|wav|wma|aac|flac|m4a/i) {
        $obj->class('audio');
    } elsif ( $ext =~ /mov|avi|3gp|asf|mp4|qt|wmv|asx|mpg|flv|mkv|ogm/i) {
        $obj->class('video');
    } else {
        $obj->class('file');
    }

    my $mime_type = 'image/' . lc $ext if $obj->class eq 'image';
    $obj->mime_type( $mime_type );

    $obj->save or die $obj->errstr;

    require MT::FileMgr;
    my $fmgr = MT::FileMgr->new('Local');

    my $app = MT->instance;

    my $blog = MT::Blog->load({ id => $blog_id });
    my $outdir = File::Spec->catdir( $blog->site_path, 'assets' );
    undef $blog;
    $fmgr->mkpath( $outdir )
        or return $app->error(
            $app->translate(
                'Failed to make assets directory [_1]',
                $fmgr->errstr,
        ));

    my $path = File::Spec->catfile( $outdir, $file_name );

    unless (defined $fmgr->put( $file_path, $path, 'upload')) {
        $cb->( $plugin->translate('Registration failure of Asset([_1]).', $file_path) . "\n" );
        $app->log(
                $app->translate(
                    'Failed to publish asset file [_1]',
                    $fmgr->errstr,
            ));
        return 0;
    }
    undef $fmgr;
    $cb->( $plugin->translate('Asset([_1]) is registered by ID[_2].', $file_path, $obj->id) . "\n" );
    my $id = $obj->id;
    undef $obj;
    return $id;
}

sub _check {
    my ($value, $data, $counter, $cb) = @_;
    my $plugin = MT->component("CSVDataImExporter");
    if ($value eq 'class') {
        if (!($data eq 'page' || $data eq 'entry')) {
        $cb->( '*** ' . $counter . ':' . $plugin->translate('wrong class specification ([_1])', $data) . "\n" );
            return 1;
        }
    }
    elsif ($value eq 'id') {
        if ($data && ($data !~ /\d+/)) {
            $cb->( '*** ' . $counter . ':' . $plugin->translate('character([_1]) which is not a number is specified as id.', $data) . "\n" );
            return 1;
        }
    }
    elsif ($value eq 'author') {
        my $author = MT::Author->load( { name => $data } );
        unless ($author) {
            $cb->( '*** ' . $counter . ':' . $plugin->translate('user who specified it as author([_1]) is not registered.', $data) . "\n" );
            return 1;
        }
    }
    elsif ($value eq 'status') {
        if (!($data == 1 || $data == 2 || $data == 4)) {
            $cb->( '*** ' . $counter . ':' . $plugin->translate('wrong value([_1]) of status.', $data) . "\n" );
            return 1;
        }
    }
    elsif ($value eq 'authored_on') {
        if (!($data =~ /\d{14}|\d{4}-\d+-\d+T\d+:\d+:\d+\.\d{3}|\d{4}-\d+-\d+\s\d+:\d+:\d+|\d{4}\/\d+\/\d+\s\d+:\d{2}|\d{4}\.\d+\.\d+\s\d+:\d{2}/)) {
            $cb->( '*** ' . $counter . ':' . $plugin->translate('wrong value([_1]) of authored_on.', $data) . "\n" );
            return 1;
        }
    }
    elsif ($value eq 'modified_on') {
        if (!($data =~ /\d{14}|\d{4}-\d+-\d+T\d+:\d+:\d+\.\d{3}|\d{4}-\d+-\d+\s\d+:\d+:\d+|\d{4}\/\d+\/\d+\s\d+:\d{2}|\d{4}\.\d+\.\d+\s\d+:\d{2}/)) {
            $cb->( '*** ' . $counter . ':' . $plugin->translate('wrong value([_1]) of modified_on.', $data) . "\n" );
            return 1;
        }
    }
    elsif ($value eq 'convert_breaks') {
        if (!($data eq '0' || $data eq '1' || $data eq '__default__' || $data eq 'richtext' ||
              $data eq 'markdown' || $data eq 'markdown_with_smartypants' || $data eq 'textile_2')) {
            $cb->( '*** ' . $counter . ':' . $plugin->translate('wrong value([_1]) of convert_breaks.', $data) . "\n" );
            return 1;
        }
    }
    return 0;
}
sub _convert_date {
    my $date = shift;
    unless ($date) {
        my ($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime(time);
        return sprintf("%04d%02d%02d%02d%02d%02d", $year + 1900, $mon + 1, $mday, $hour, $min, $sec);
    }
    $date =~ s/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d{3}/$1$2$3$4$5$6/;
    $date =~ s/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/$1$2$3$4$5$6/;
    $date =~ s!/(\d)/!/0$1/!;
    $date =~ s!/(\d)\s!/0$1 !;
    $date =~ s/\s(\d):/ 0$1:/;
    $date =~ s!(\d{4})/(\d{1,2})/(\d{1,2})\s(\d{1,2}):(\d{1,2})!$1$2$3$4${5}00!;
    $date =~ s!(\d{4})\.(\d{1,2})\.(\d{1,2})\s(\d{1,2}):(\d{1,2})!$1$2$3$4${5}00!;
    return $date;
}

sub _get_data {
    my ($line, $separator) = @_;

    $line =~ s/(?:\x0D\x0A|[\x0D\x0A])?$/$separator/;
    my @values = map {/^"(.*)"\\?$/s ? scalar($_ = $1, s/""/"/g, $_) : $_} 
           ($line =~ /("[^"]*(?:""[^"]*)*"|[^$separator]*)$separator/g);

    return @values;
}


sub export {
    my $class = shift;
    my ( $app, $blog, $cb ) = @_;

my @field = ('class','id','status','author','authored_on','modified_on','unpublished_on','convert_breaks','title','text','text_more','excerpt','keywords','categories','tags','allow_comments','allow_pings','assets','basename');

    my $field_max = $#field + 1;
    _add_customfield($app, \@field);

    $cb ||= sub { };
    my $sep = ',';

    my $plugin = MT->component("CSVDataImExporter");
    my $is_cloud = $plugin->get_config_value('is_cloud', 'system') || 0;
    my $imexport_character = get_imexport_character( $plugin, $blog->id );

    my $req = MT::Request->instance() unless $is_cloud;

    my $q = $app->param;
    my @ids = $q->param('id');
    my $iter;
    if (@ids) {
        $iter = MT::Entry->load_iter( { blog_id => $blog->id, class => $q->param('export_class'), id => \@ids } );
    } else {
        $iter = MT::Entry->load_iter( { blog_id => $blog->id, class => $q->param('export_class') } );
    }

#    require MT::Import;
#    my $importer = MT::Import->importer('import_csv');
#    my $handler  = $importer->{export_handler};
#    $handler = MT->handler_to_coderef($handler);

    $cb->( join(",", @field) );
    $cb->( "\n" );
    my $entries;
    while ( my $entry = $iter->() ) {
        my @csvdata;
        my $id;
        my $category_class;
        my $counter = 0;
        foreach my $col (@field) {
            my $data = '';
            $id = $entry->$col if $col eq 'id';
            if ($col eq 'categories') {
                $data = _get_category($id, $category_class);
            } elsif ($col eq 'author') {
                my $author = MT::Author->load( { id => $entry->author_id } );
                $data = $author->name;
            } elsif ($col eq 'tags') {
                $data = join(',', $entry->$col);
            } elsif ($col eq 'assets') {
                my @assets;
                my @obj_assets = MT::ObjectAsset->load({ object_id => $id, blog_id => $blog->id });
                foreach my $obj_asset (@obj_assets) {
                    my $asset = MT->model('asset')->load({ id => $obj_asset->asset_id, blog_id => $blog->id });
                    next if !$asset;
                    if ( $asset->label ) {
                        push(@assets, $asset->label.'('.$asset->id.')');
                    } else {
                        push(@assets, $asset->file_name.'('.$asset->id.')');
                    }
                    $data = join(',', @assets);
                }
            } elsif ($counter >= $field_max) {

                my $field;
                if ($is_cloud) {
                    $field = MT->model('field')->load(
                        {   basename => $col,
                            blog_id  => [ 0, $entry->blog_id ],
                            obj_type => $q->param('export_class')
                        }
                    );
                } else {
                    $field = $req->cache( $col . $entry->blog_id );
                    unless ($field) {
                        $field = MT->model('field')->load(
                            {   basename => $col,
                                blog_id  => [ 0, $entry->blog_id ],
                                obj_type => $q->param('export_class')
                            }
                        );
                        $req->cache( $col . $entry->blog_id, $field )
                            if $field;
                    }
                }
                next unless $field;

                my $key = 'field.' . $col;
                $data = $entry->$key;

                if ($field->type eq 'datetime') {
                    if ($data) {
                        $data =~ s/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/$1-$2-$3 $4:$5:$6/;
                    } else {
                        $data = '';
                    }
                }
            } else {
                my $field_name = 'field.' . $col;
                if ( $entry->has_meta( $field_name ) ) {
                    $data = $entry->$field_name;
                } else {
                    $data = $entry->$col;
                }
            }

            if ($col eq 'class') {
                $category_class = MT->model($entry->class eq 'entry' ? 'category' : 'folder');
            }
            if ($col eq 'authored_on' || $col eq 'modified_on') {
                $data =~ s/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/$1-$2-$3 $4:$5:$6/;
            }

            $data =~ s/"/""/g;
            if ($data =~ /\r?\n|,|"/) {
                $data = '"'.$data.'"';
            }
            push ( @csvdata, encode_text($data, 'utf-8', $imexport_character) );
            $counter++;
        }
        $cb->( join(",", @csvdata) );
        $cb->( "\n" );
        undef $entry;
        undef @csvdata;
    }
    undef @field;
}

sub _add_customfield {
    my $app = shift;
    my $field = shift;

    my $blog_id = $app->param('blog_id');

    my $iter;
    if ($app->param('export_class') eq '*') {
        $iter = CustomFields::Field->load_iter(
               { blog_id => [0, $blog_id],
                 obj_type => 'entry',
               });
        while (my $f = $iter->()) {
            push(@$field, $f->basename);
        }
        $iter = CustomFields::Field->load_iter(
               { blog_id => [0, $blog_id],
                 obj_type => 'page',
               });
        while (my $f = $iter->()) {
            push(@$field, $f->basename);
        }
    } else {
        $iter = CustomFields::Field->load_iter(
               { blog_id => [0, $blog_id],
                 obj_type => $app->param('export_class'),
               });
        while (my $f = $iter->()) {
            push(@$field, $f->basename);
        }
    }
}

sub _get_category {
    my ($id, $category_class) = @_;
    my $data = '';
    my $place = MT::Placement->load( { entry_id => $id, is_primary => 1 } );
    if ($place) {
        my $primary = '';
        my $cat = $category_class->load( { id => $place->category_id } );
        $primary = $cat->label.'('.$cat->id.":".$cat->basename.')';
        while ($cat->parent != 0) {
            $cat = $category_class->load( { id => $cat->parent } );
            $primary = $cat->label.'('.$cat->id.":".$cat->basename.')'.$category_separator.$primary;
        }

        my @places = MT::Placement->load( { entry_id => $id, is_primary => 0 } );
        my @sec;
        foreach my $p (@places) {
            my $secondary = '';
            my $cat = $category_class->load( { id => $p->category_id } );
            $secondary .= $cat->label.'('.$cat->id.":".$cat->basename.')';
            while ($cat->parent != 0) {
                $cat = $category_class->load( { id => $cat->parent } );
                $secondary = $cat->label.'('.$cat->id.":".$cat->basename.')'.$category_separator.$secondary;
            }
            push(@sec, $secondary);
        }
        $data = $primary . (@sec ? "," . join(",", @sec) : '');
    }
    return $data;
}

1;