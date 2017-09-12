package CustomFieldsListing::Util;

use strict;
use MT;

sub create_thumbnail_html {
    my ($app, $asset, $fmgr) = @_;

    my $file_path = $asset->file_path;
    my $thumb_size = 45;
    my $class_type = $asset->class_type;
    my $label = $asset->label || $asset->file_name || $class_type;
    my $edit_link = $app->uri(
        mode => 'view',
        args => {
            _type   => 'asset',
            id      => $asset->id,
            blog_id => $asset->blog_id,
        },
    );

    my $thumbnail_html = '';
    if ($file_path && $fmgr->exists($file_path)) {
        my $img = MT->static_path . 'images/asset/' . $class_type . '-45.png';
        if ($asset->has_thumbnail) {
            my ($orig_width, $orig_height)
                = ($asset->image_width, $asset->image_height);
            my ($thumbnail_url, $thumbnail_width, $thumbnail_height);
            if ($orig_width > $thumb_size &&
                $orig_height > $thumb_size) {
                ($thumbnail_url, $thumbnail_width, $thumbnail_height)
                    = $asset->thumbnail_url(
                        Height => $thumb_size,
                        Width  => $thumb_size,
                        Square => 1
                    );
            }
            elsif ($orig_width > $thumb_size) {
                ($thumbnail_url, $thumbnail_width, $thumbnail_height)
                    = $asset->thumbnail_url(Width => $thumb_size);
            }
            elsif ($orig_height > $thumb_size) {
                ($thumbnail_url, $thumbnail_width, $thumbnail_height)
                    = $asset->thumbnail_url(Height => $thumb_size);
            }
            else {
                ($thumbnail_url, $thumbnail_width, $thumbnail_height)
                    = ($asset->url, $orig_width, $orig_height);
            }

            my $thumbnail_width_offset =
                int(($thumb_size - $thumbnail_width) / 2);
            my $thumbnail_height_offset =
                int(($thumb_size - $thumbnail_height) / 2);
            $thumbnail_html = qq{
                <span class="title"><a href="$edit_link">$label</a></span>
                <div class="thumbnail picture small">
                    <a href="$edit_link"><img alt="$label" title="$label" src="$thumbnail_url" style="padding: ${thumbnail_height_offset}px ${thumbnail_width_offset}px" /></a>
                </div>
            };
        }
        else {
            $thumbnail_html = qq{
                <span class="title"><a href="$edit_link">$label</a></span>
                <div class="file-type $class_type picture small">
                    <a href="$edit_link"><img alt="$label" title="$label" src="$img" class="asset-type-icon asset-type-$class_type" /></a>
                </div>
            };
        }
    }
    else {
        my $img = MT->static_path . 'images/asset/' . $class_type . '-warning-45.png';
        $thumbnail_html = qq{
            <span class="title"><a href="$edit_link">$label</a></span>
            <div class="file-type missing picture small">
                <a href="$edit_link"><img alt="$label" title="$label" src="$img" class="asset-type-icon asset-type-$class_type" /></a>
            </div>
        };
    }
    return $thumbnail_html;
}

1;
