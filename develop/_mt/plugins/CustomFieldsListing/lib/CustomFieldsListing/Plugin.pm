package CustomFieldsListing::Plugin;

use strict;

use MT;
use MT::ListProperty;
use MT::Util;
use CustomFieldsListing::Util;

my ($can_cf, $can_acf);
eval "use CustomFields::Field;";
$can_cf = 1 if (!$@);
eval "use AnotherCustomFields::Util;";
$can_acf = 1 if (!$@);

sub init_request {
    my ($eh, $app) = @_;
    my $plugin = $app->component('CustomFieldsListing');

    # load customfield_objects / another customfield classes
    my $cf_objs = $app->registry('customfield_objects');
    my $acf_classes = $app->registry('acf_field_classes');
    my $html_reg = $app->registry('acf_field_types');
    my $type = $app->param('_type') || $app->param('datasource') || '';
    my ($org_type, $tmp_type, $sub_type, $acf_tmp_type);
    $tmp_type = $type;
    $acf_tmp_type = $type;
    $org_type = $type;
    if ($type eq 'asset') {
        $sub_type = [ 'file', 'audio', 'video', 'image' ];
        $tmp_type = 'file';
    }
    elsif ($type eq 'member') {
        $type = 'author';
        $tmp_type = 'author';
        $acf_tmp_type = 'author';
    }
    return 1 unless (($app->mode eq 'list' || $app->mode eq 'filtered_list' || $app->mode eq 'save_filter') && 
                     ($cf_objs->{$tmp_type} || $acf_classes->{$acf_tmp_type}));

    my $user_cookie = $app->cookies->{$app->user_cookie}->{value}->[0];
    $user_cookie =~ /^(.+?)\:/;
    my $user_name = $1;
    my $author = MT->model('author')->load({ name => $user_name })
        or return $app->error($plugin->translate('No user'));
    $app->set_language($author->preferred_language);

    # load customfields
    my $blog;
    my $blog_id = $app->param('blog_id') || 0;
    $blog_id = 0 if ($type eq 'author');
    my @blog_ids;
    push @blog_ids, 0;
    if ($blog_id) {
        $blog = $app->blog;
        push @blog_ids, $blog_id;
        if (!$blog->is_blog) {
            my @child_blogs = $app->model('blog')->load({ parent_id => $blog_id });
            push @blog_ids, map { $_->id } @child_blogs;
        }
    }
    else {
        my @websites = $app->model('website')->load;
        for my $website (@websites) {
            push @blog_ids, $website->id;
            my @child_blogs = $app->model('blog')->load({ parent_id => $website->id });
            push @blog_ids, map { $_->id } @child_blogs;
        }
    }
    my ($cf_types, $acf_fields, @fields, %field_data);
    if ($can_cf) {
        $cf_types = $app->registry('customfield_types');
        @fields = CustomFields::Field->load({
            obj_type => ($sub_type) ? $sub_type : $type,
            blog_id => \@blog_ids
        });
        %field_data = map { $_->basename => $_ } @fields;
    }
    if ($can_acf) {
        $acf_fields = AnotherCustomFields::Util::load_field_info($type);
        push @fields, @$acf_fields;
        for my $field (@$acf_fields) {
            $field->{acf} = 1;
            $field_data{$field->{field_name}} = $field;
        }
    }
    my %blog_order;
    for (my $i = 0; $i < scalar(@blog_ids); $i++) {
        $blog_order{$blog_ids[$i]} = $i;
    }

    # sort entry / page customfields
    my %fields;
    my $order = 0;
    my $priv_order = 10000;
    my %field_order;
    if ($type eq 'entry' || $type eq 'page') {
        my @perm_blog_ids = @blog_ids;
        shift @perm_blog_ids;
        shift @perm_blog_ids if ($blog && !$blog->is_blog && $type eq 'entry');
        my @perms = MT->model('permission')->load({
            blog_id => \@perm_blog_ids,
            author_id => $author->id,
        });
        @perms = sort {
            $blog_order{$a->blog_id} <=> $blog_order{$b->blog_id} 
        } @perms;
        my %acf_field_names;
        for my $perm (@perms) {
            my @prefs_org = split '\|', $perm->column($type . '_prefs');
            my @prefs = split ',', $prefs_org[0];
            my %cf_fields;
            for my $pref (@prefs) {
                if ($pref =~ /^customfield_(.*)$/) {
                    if (defined($field_data{$1})) {
                        $cf_fields{$1} = 1;
                        my $key = 'blog' . $field_data{$1}->blog_id . '_' . $1;
                        if (!$field_order{$key}) {
                            $field_order{$key} = $priv_order;
                            $priv_order += 100;
                        }
                    }
                }
                elsif ($blog_id == $perm->blog_id &&
                       defined($field_data{$pref}->{acf})) {
                    $acf_field_names{$pref} = 1;
                    if (!$field_order{$pref}) {
                        $field_order{$pref} = $priv_order;
                        $priv_order += 100;
                    }
                }
            }
            my @no_show_fields = grep {
                !$_->{acf}
                &&
                $perm->blog_id == $_->blog_id
                &&
                !defined($cf_fields{$_->basename})
            } @fields;
            for my $field (@no_show_fields) {
                my $key = 'blog' . $field->blog_id . '_' . $field->basename;
                if (!$field_order{$key}) {
                    $field_order{$key} = $priv_order;
                    $priv_order += 100;
                }
            }
        }
        my @acf_fields = grep {
            $_->{acf} && !defined($acf_field_names{$_->{field_name}})
        } @fields;
        for my $field (@acf_fields) {
            if (!$field_order{$field->{field_name}}) {
                $field_order{$field->{field_name}} = $priv_order;
                $priv_order += 100;
            }
        }
        my @sys_fields = grep { !$_->{acf} && !$_->blog_id } @fields;
        for my $field (@sys_fields) {
            my $key = 'blog' . $field->blog_id . '_' . $field->basename;
            if (!$field_order{$key}) {
                $field_order{$key} = $priv_order;
                $priv_order += 100;
            }
        }
    }
    my $priv_max_order = $priv_order;

    my $native_sort =
        $plugin->get_config_value(
            'fjcfl_enable_native_sort',
            ($blog_id) ? 'blog:' . $blog_id : undef
        );

    # create listing properties
    my $cf_props = $app->registry('customfields_list_properties');
    foreach my $field (@fields) {
        if ($field->{acf}) {
            if ($field->{field_blog_id}) {
                next if ($blog && $blog->is_blog && !$field->{field_blog_id}->{$blog->id});
            }

            my %field_options;
            my $field_name = $field->{field_name};
            my $base;
            if ($field->{field_data_type} eq 'integer' ||
                $field->{field_data_type} eq 'float') {
                $base = '__virtual.integer';
            }
            else {
                $base = '__virtual.string';
            }
            my $label = $field->{field_label};
            $label = $label->() if (ref $label eq 'CODE');
            my $field_type = $field->{field_type};
            if ($html_reg->{$field_type}->{init_listing}) {
                %field_options = %{$html_reg->{$field_type}->{init_listing}->($field, \%field_options)};
            }
            elsif ($field_type eq 'select' ||
                $field_type eq 'radio') {
                AnotherCustomFields::Util::init_field_options($field);
                my @options = @{$field->{field_options}};
                @options = map {
                    if (ref $_ eq 'HASH') {
                        { label => $_->{label}, value => $_->{option} };
                    }
                    else {
                        { label => $_, value => $_ };
                    }
                } @options;
                my %show_options;
                map {
                    $show_options{$_->{option}} = $_->{label}
                } @{$field->{field_options}};
                %field_options = (
                    col_class => 'string',
                    base => '__virtual.single_select',
                    html => \&show_select,
                    single_select_options => \@options,
                    show_options => \%show_options,
                    filter_tmpl => '<mt:var name="filter_form_single_select">',
                    show_saved_value => $field->{field_show_saved_value},
                    $field->{field_show_saved_value}
                        ? (sub_fields => [
                              {
                                  class => 'acf_select_' . $field->{field_name},
                                  label => $field->{field_label} . $plugin->translate('(saved value)'),
                                  display => 'optional',
                              }
                          ])
                        : (),
                    sort => \&acf_sort,
                );
            }
            elsif ($field_type eq 'image' ||
                   $field_type eq 'audio' ||
                   $field_type eq 'video' ||
                   $field_type eq 'file') {
                %field_options = (
                    col_class => $field_type,
                    bulk_html => \&bulk_image,
                );
            }
            elsif ($field_type eq 'checkbox') {
                my @options = (
                    { label => $plugin->translate('On'), value => 1 },
                    { label => $plugin->translate('Off'), value => 0 },
                );
                %field_options = (
                    base => '__virtual.single_select',
                    html => \&show_checkbox,
                    col_class => 'chkbox',
                    single_select_options => \@options,
                    filter_tmpl => '<mt:var name="filter_form_single_select">',
                    sort => \&acf_sort,
                );
            }
            elsif ($field_type eq 'datetime' ||
                   $field_type eq 'date' ||
                   $field_type eq 'time') {
                %field_options = (
                    base => '__virtual.date',
                    html => \&show_datetime,
                    col_class => 'date',
                    ($field_type eq 'time')
                        ? (filter_tmpl => '<mt:var name="filter_form_integer">')
                        : (filter_tmpl => sub {
                              my $prop  = shift;
                              my $label = '<mt:var name="label">';
                              my $tmpl = 'filter_form_date';
                              my $opts = '<mt:var name="date_filter_options">';
                              my $contents = '<mt:var name="date_filter_contents">';
                              return MT->translate(
                                  '<mt:var name="[_1]"> [_2] [_3] [_4]',
                                  $tmpl, $label, $opts, $contents );
                          }),
                );
            }
            else {
                %field_options = (
                    base => $base,
                    html => \&show_field_value,
                );
            }
            $fields{$field_name} = {
                label => $label,
                field => $field,
                display => 'optional',
                order =>
                    $field_order{$field_name}
                        ? $field_order{$field_name}
                        : 'nopriv_' . $order,
                col => $field_name,
                %field_options
            };
            $order += 100 unless (defined($field_order{$field_name}));
        }
        else {
            my $key = 'blog' . $field->blog_id . '_' . $field->basename;
            my $column_def = $cf_types->{$field->type}->{column_def};
            my %field_options;
            if (defined($cf_props->{$field->type})) {
                %field_options = %{$cf_props->{$field->type}};
            }
            elsif ($field->type eq 'image' ||
                $field->type eq 'audio' ||
                $field->type eq 'video' ||
                $field->type eq 'file') {
                %field_options = (
                    col_class => $field->type,
                    bulk_html => \&bulk_image,
                );
            }
            elsif ($field->type eq 'select' || $field->type eq 'radio') {
                my @options = split ',', $field->options;
                @options = map {
                    { label => $_, value => $_ }
                } @options;
                %field_options = (
                    html => \&show_field_value,
                    col_class => 'string',
                    single_select_options => \@options,
                    ($native_sort && ($field->blog_id == $blog_id || $field->blog_id == 0) && $type ne 'asset')
                        ? (sort => \&sort)
                        : (bulk_sort => \&bulk_sort),
                    terms => \&terms,
                    filter_tmpl => '<mt:var name="filter_form_single_select">',
                );
            }
            elsif ($field->type eq 'checkbox') {
                my @options = (
                    { label => $plugin->translate('On'), value => 1 },
                    { label => $plugin->translate('Off'), value => 0 },
                );
                %field_options = (
                    html => \&show_checkbox,
                    col_class => 'chkbox',
                    single_select_options => \@options,
                    ($native_sort && ($field->blog_id == $blog_id || $field->blog_id == 0) && $type ne 'asset')
                        ? (sort => \&sort)
                        : (bulk_sort => \&bulk_sort),
                    terms => \&terms,
                    filter_tmpl => '<mt:var name="filter_form_single_select">',
                );
            }
            elsif ($field->type eq 'datetime') {
                %field_options = (
                    col_class => 'date',
                    html => \&show_datetime,
                    ($native_sort && ($field->blog_id == $blog_id || $field->blog_id == 0) && $type ne 'asset')
                        ? (sort => \&sort)
                        : (bulk_sort => \&bulk_sort),
                    terms => \&terms,
                    ($field->options eq 'time')
                        ? (filter_tmpl => '<mt:var name="filter_form_integer">')
                        : (filter_tmpl => sub {
                              my $prop  = shift;
                              my $label = '<mt:var name="label">';
                              my $tmpl = 'filter_form_date';
                              my $opts = '<mt:var name="date_filter_options">';
                              my $contents = '<mt:var name="date_filter_contents">';
                              return MT->translate(
                                  '<mt:var name="[_1]"> [_2] [_3] [_4]',
                                  $tmpl, $label, $opts, $contents );
                          }),
                );
            }
            else {
                %field_options = (
                    col_class =>
                        ($column_def =~ /^(vinteger|vfloat)/)
                        ? 'num'
                        : 'string',
                    html => \&show_field_value,
                    ($native_sort && ($field->blog_id == $blog_id || $field->blog_id == 0) && $type ne 'asset')
                        ? (sort => \&sort)
                        : (bulk_sort => \&bulk_sort),
                    terms => \&terms,
                    filter_tmpl =>
                        ($column_def =~ /^(vinteger|vfloat)/)
                        ? '<mt:var name="filter_form_integer">'
                        : '<mt:var name="filter_form_string">',
                );
            }

            $fields{$key} = {
                label => $field->name,
                order =>
                    $field_order{$key}
                        ? $field_order{$key}
                        : 'nopriv_' . $order,
                display => 'optional',
                obj_class => $type,
                col => 'field.' . $field->basename,
                field => $field,
                field_column_def => $column_def,
                raw => \&raw_value,
                %field_options
            };
            $order += 100 unless (defined($field_order{$key}));
        }
    }

    for my $key (keys %fields) {
        if ($fields{$key}->{order} =~ /nopriv_(\d+)/) {
            $fields{$key}->{order} = $priv_max_order + $1;
        }
    }

    my %field_map;
    for my $key (keys %fields) {
       if ($fields{$key}->{field}->{acf}) {
       }
       else {
           $field_map{$fields{$key}->{field}->type} = []
                unless (defined($field_map{$fields{$key}->{field}->type}));
           push @{$field_map{$fields{$key}->{field}->type}}, $key;
       }
    }
    $app->run_callbacks('customfields.list_properties', $app, \%fields, \%field_map);

    $type = 'member' if ($org_type eq 'member');
    $plugin->registry({
        list_properties => {
            $type => \%fields,
        },
    });

    1;
}

sub raw_value {
    my ($prop, $obj) = @_;
    my $value = $obj->meta($prop->col);
    return defined($value) ? $value : '';
}

sub show_field_value {
    my ($prop, $obj) = @_;
    my $value;
    if ($prop->field->{acf}) {
        $value = $obj->column($prop->col);
    }
    else {
        $value = $obj->meta($prop->col);
    }
    return defined($value) ? MT::Util::encode_html($value) : '-';
}

sub show_checkbox {
    my ($prop, $obj) = @_;
    my $app = MT->instance;

    my $value;
    if ($prop->field->{acf}) {
        $value = $obj->column($prop->col);
    }
    else {
        $value = $obj->meta($prop->col);
    }
    return '-' unless (defined($value));
    return '' if (!$value);
    return '<img src="' . $app->static_path . 'plugins/CustomFieldsListing/images/checked.gif" alt="">';
}

sub show_datetime {
    my ($prop, $obj) = @_;
    my $app = MT->instance;
    my $blog = $app->blog;
    my ($value, $type);
    if ($prop->field->{acf}) {
        $value = $obj->column($prop->col);
        $type = $prop->field->{field_type};
    }
    else {
        $value = $obj->meta($prop->col);
        $type = $prop->field->options;
    }
    return '-' unless(defined($value));
    if ($type eq 'datetime') {
        $value = MT::Util::format_ts('%x %X', $value, $blog);
    }
    elsif ($type eq 'date') {
        $value = MT::Util::format_ts('%x', $value, $blog);
    }
    elsif ($type eq 'time') {
        $value = MT::Util::format_ts('%X', $value, $blog);
    }
    return defined($value) ? MT::Util::encode_html($value) : '-';
}

sub show_select {
    my ($prop, $obj) = @_;
    my $value = $obj->column($prop->col);
    unless(defined($value)) {
        return '-';
    }
    my $options = $prop->show_options;
    my $html = '<div>' . MT::Util::encode_html($options->{$value}) . '</div>';
    if ($prop->show_saved_value) {
        $html .= '<div class="acf_select_' . $prop->field->{field_name} . '">(' . MT::Util::encode_html($value) . ')</div>';
    }
    return $html;
}

sub bulk_image {
    my ($prop, $objs, $app, $opts) = @_;
    my $plugin = $app->component('CustomFieldsListing');

    require MT::Asset;

    my (%asset_ids, %obj_asset_ids);
    if ($prop->field->{acf}) {
        foreach my $obj (@$objs) {
            my $id = $obj->column($prop->col);
            $obj_asset_ids{$obj->id} = [] if (!$obj_asset_ids{$obj->id});
            push @{$obj_asset_ids{$obj->id}}, $id;
            $asset_ids{$id} = 1;
        }
    }
    else {
        foreach my $obj (@$objs) {
            my $value = $obj->meta($prop->col);
            while ( $value
                =~ m!<form[^>]*?\smt:asset-id=["'](\d+)["'][^>]*?>(.+?)</form>!gis )
            {
                my $id = $1;
                $obj_asset_ids{$obj->id} = [] if (!$obj_asset_ids{$obj->id});
                push @{$obj_asset_ids{$obj->id}}, $id;
                $asset_ids{$id} = 1;
            }
        }
    }
    my @asset_ids = keys %asset_ids;
    my @assets = $app->model('asset')->load({ id => \@asset_ids });
    my %assets = map { $_->id => $_ } @assets;

    require MT::FileMgr;
    my $fmgr = MT::FileMgr->new('Local');
    my @rows;
    for my $obj (@$objs) {
        my $asset;
        for my $asset_id (@{$obj_asset_ids{$obj->id}}) {
            if ($assets{$asset_id}) {
                $asset = $assets{$asset_id};
                last;
            }
        }
        if ($asset) {
            push @rows, CustomFieldsListing::Util::create_thumbnail_html($app, $asset, $fmgr);
        }
        else {
            push @rows, '-';
        }
    }
    return @rows;
}

sub terms {
    my ($prop, $args, $db_terms, $db_args) = @_;

    my $blog = MT->app->blog;
    my $blog_id = ($blog) ? $blog->id : 0;
    my $app = MT->instance;
    my $option = $args->{option};

    my $class = $prop->datasource;
    my $meta_class = $class->meta_pkg;
    my $meta_pk = $meta_class->primary_key_tuple;
    $meta_pk = $meta_pk->[0];
    my $meta_id_cond = '= ' . $meta_pk;

    my ($query, @query_a);

    if ($prop->field->type eq 'datetime' &&
        $prop->field->options ne 'time') {
        my $option = $args->{option};
#        my $blog = MT->app ? MT->app->blog : undef;
        my $now = MT::Util::epoch2ts( $blog, time() );
        my $from   = $args->{from}   || undef;
        my $to     = $args->{to}     || undef;
        my $origin = $args->{origin} || undef;
        $from   =~ s/\D//g;
        $to     =~ s/\D//g;
        $origin =~ s/\D//g;
        $from .= '000000' if $from;
        $to   .= '235959' if $to;

        if ( 'range' eq $option ) {
            @query_a = (
                [
                    { $prop->field_column_def => { op => '>', value => $from } },
                    '-and',
                    { $prop->field_column_def => { op => '<', value => $to } },
                ]
            );
        }
        elsif ( 'days' eq $option ) {
            my $days   = $args->{days};
            my $origin = MT::Util::epoch2ts( $blog,
                time - $days * 60 * 60 * 24 );
            @query_a = (
                [
                    { $prop->field_column_def => { op => '>', value => $origin } },
                    '-and',
                    { $prop->field_column_def => { op => '<', value => $now } },
                ]
            );
        }
        elsif ( 'before' eq $option ) {
            $query = { op => '<', value => $origin . '000000' };
        }
        elsif ( 'after' eq $option ) {
            $query = { op => '>', value => $origin . '235959' };
        }
    }
    else {
        if (defined($args->{string})) {
            my $value  = $args->{string};
            if ('contains' eq $option) {
                $query = { like => "%$value%" };
            }
            elsif ('not_contains' eq $option) {
                $query = { not_like => "%$value%" };
            }
            elsif ('beginning' eq $option) {
                $query = { like => "$value%" };
            }
            elsif ('end' eq $option) {
                $query = { like => "%$value" };
            }
            else {
                $query = $value;
            }
        }
        elsif (defined($args->{value})) {
            my $value = $args->{value};
            if ($prop->field->type eq 'datetime' &&
                $prop->field->options eq 'time') {
                $value =~ s/\D//g;
                $value = '0' . $value if (length($value) == 3);
                $value .= '00' if (length($value) == 4);
                $value = '19700101' . $value;
            }
            if ('greater_than' eq $option) {
                $query = { '>' => $value };
            }
            elsif ('greater_equal' eq $option) {
                $query = { '>=' => $value };
            }
            elsif ('less_than' eq $option) {
                $query = { '<' => $value };
            }
            elsif ('less_equal' eq $option) {
                $query = { '<=' => $value };
            }
            elsif ('not_equal' eq $option) {
                $query = { not => $value };
            }
            else {
                $query = $value;
            }
        }
    }
    my (@j_terms, %j_args);
    @j_terms = (
        { type => $prop->col },
        { $meta_pk => \$meta_id_cond },
    );
    push @j_terms, { $prop->field_column_def => $query } if defined($query);
    push @j_terms, @query_a if @query_a;
    %j_args = (
        unique => 1,
        alias => 'blog_' . $prop->field->blog_id . '_' . $prop->field->basename,
    );
    push @{ $db_args->{joins} },
        $prop->datasource->meta_pkg->join_on( undef, \@j_terms , \%j_args);

    return;
}

sub sort {
    my $prop = shift;
    my ($terms, $args) = @_;
    my $class = $prop->datasource;
    my $meta_class = $class->meta_pkg;
    my $meta_pk = $meta_class->primary_key_tuple;
    $meta_pk = $meta_pk->[0];
    my $meta_id_cond = '= ' . $meta_pk;

    $args->{joins} ||= [];
    delete $args->{sort};
    push @{ $args->{joins} }, $prop->datasource->meta_pkg->join_on(
        undef,
        {
            $meta_pk => \$meta_id_cond,
            type => $prop->col,
        },
        {
            sort      => $prop->field_column_def,
            direction => delete $args->{direction},
            alias     => 'blog_' . $prop->field->blog_id . '_' . $prop->field->basename,
        },
    );
    return;
}

sub acf_sort {
    my ($prop, $terms, $args) = @_;
    my $column = $prop->col;
    $args->{sort} = $column;
    return;
}

sub bulk_sort {
    my ($prop, $objs, $app, $opts) = @_;

    my $class = $prop->datasource;
    my $meta_class = $class->meta_pkg;
    my $meta_pk = $meta_class->primary_key_tuple;
    $meta_pk = $meta_pk->[0];
    my @obj_ids = map { $_->id } @$objs;
    my ($terms, $args);
    $terms =
        {
            $meta_pk => \@obj_ids,
            type => $prop->col,
        };
    $args = 
        {
            fetch_only => {
                $meta_pk => 1,
                $prop->field_column_def => 1,
            },
        };
    my @cf_values = $meta_class->search($terms, $args
    );
    my %cf_values = map {
        $_->column($meta_pk) => $_->column($prop->field_column_def)
    } @cf_values;
    if ($prop->field_column_def =~ /^(vinteger|vfloat)/) {
        return sort {
            !defined($cf_values{$a->id}) ? -1
            : !defined($cf_values{$b->id}) ? 1
            : ($cf_values{$a->id} || 0) <=> ($cf_values{$b->id} || 0)
        } @$objs;
    }
    else {
        return sort {
            !defined($cf_values{$a->id}) ? -1
            : !defined($cf_values{$b->id}) ? 1
            : ($cf_values{$a->id} || '') cmp ($cf_values{$b->id} || '')
        } @$objs;
    }
}

sub header_add_styles {
    my ($cb, $app, $param, $tmpl) = @_;

    return 1 if ($app->param('__mode') ne 'list');

    my $heads = $tmpl->getElementsByTagName('setvarblock');
    my $head;
    foreach (@$heads) {
        if ( $_->attributes->{name} =~ /html_head$/ ) {
            $head = $_;
            last;
        }
    }
    return 1 unless $head;

    require MT::Template;
    bless $head, 'MT::Template::Node';
    my $html_head = $tmpl->createElement( 'setvarblock',
        { name => 'html_head', append => 1 } );
    my $innerHTML = q{
<link rel="stylesheet" href="<mt:var name="static_uri">plugins/CustomFieldsListing/css/style.css" type="text/css" media="screen" charset="utf-8" />
};
    $html_head->innerHTML($innerHTML);
    $tmpl->insertBefore( $html_head, $head );
    1;
}

sub list_props {
    my $plugin = MT->component('CustomFieldsListing');
    return {
        field => {
            description_2 => {
                base => '__virtual.string',
                label => $plugin->translate('Description'),
                display => 'optional',
                order => 150,
                html => sub { prop_html('description', @_); },
                sort => sub { prop_sort('description', @_); },
            },
            basename_2 => {
                base => '__virtual.string',
                label => $plugin->translate('Basename'),
                display => 'optional',
                order => 400,
                html => sub { prop_html('basename', @_); },
                sort => sub { prop_sort('basename', @_); },
            },
            default => {
                auto => 1,
                label => $plugin->translate('Default'),
                display => 'optional',
                order => 350,
            },
            options => {
                auto => 1,
                label => $plugin->translate('Options'),
                display => 'optional',
                order => 350,
            },
            required_2 => {
                base => '__virtual.string',
                label => $plugin->translate('Required'),
                display => 'optional',
                col_class => 'cf_required',
                order => 400,
                html => sub { required_html(@_); },
                sort => sub { prop_sort('required', @_); },
            },
            tag_2 => {
                base => '__virtual.string',
                label => $plugin->translate('Tag(List)'),
                display => 'optional',
                order => 140,
                html => sub { tag_html(@_); },
                sort => sub { prop_sort('tag', @_); },
            },
        },
    };
}

sub prop_html {
    my ($field, $prop, $obj) = @_;
    return MT::Util::encode_html($obj->column($field));
}

sub tag_html {
    my ($prop, $obj) = @_;
    if ($obj && $obj->has_column('tag')) {
        return 'MT' . MT::Util::encode_html($obj->tag);
    }
    else {
        return '';
    }
}

sub required_html {
    my ($prop, $obj) = @_;
    my $app = MT->instance;

    return ($obj->required)
        ? '<img src="' . $app->static_path . 'plugins/CustomFieldsListing/images/checked.gif" alt="">'
        : '';
}

sub prop_sort {
    my ($field, $prop, $terms, $args) = @_;
    $args->{sort} = $field;
}

1;
