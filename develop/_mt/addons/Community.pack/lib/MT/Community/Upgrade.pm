# Movable Type (r) (C) 2007-2017 Six Apart, Ltd. All Rights Reserved.
# This code cannot be redistributed without permission from www.sixapart.com.
# For more information, consult your Movable Type license.
#
# $Id$

package MT::Community::Upgrade;

use strict;

sub community_remove_profile_error {
    my $plugin = shift;
    my (%param) = @_;

    require MT::Template;
    $plugin->progress(
        $plugin->translate_escape(
            'Removing Profile Error global system template...')
    );
    MT::Template->remove( { type => 'profile_error' } );
    1;
}

1;
