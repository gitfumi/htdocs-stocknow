package CSVDataImExporter::CMS;

use strict;
use warnings;

sub add_script {
    my ($cb, $app, $tmpl) = @_;

    my $old = <<HERE;
</script>
HERE
    $old = quotemeta($old);

    my $new = <<HERE;
jQuery(function(){
    change_form();
    jQuery('select[name=import_type]').change(function(){
        change_form();
    });
});
function change_form() {
    if ( jQuery('select[name=import_type] option:selected').val() == 'import_csv' ) {
        jQuery('#import_as_me-field').hide();
        jQuery('#convert_breaks-field').hide();
        jQuery('#encoding-field').hide();
        jQuery('#default_cat_id-field').hide();
    } else {
        jQuery('#import_as_me-field').show();
        jQuery('#convert_breaks-field').show();
        jQuery('#encoding-field').show();
        jQuery('#default_cat_id-field').show();
    }
}
</script>
HERE

    $$tmpl =~ s/$old/$new/;
}

1;
