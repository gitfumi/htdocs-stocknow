# Copyright 2003 Stepan Riha. This code cannot be redistributed without
# permission from www.nonplus.net.

=head1 <MTRelativeURL> tags

Free for personal or commercial use. 

Version 1.0 - May 20 2003
Initial release

Tags:

	MTRelativeUrlVersion
	MTRelativeUrlBase
	MTRelativeUrl
	relative_url (filter)

Example:

	<MTRelativeURLBase><MTEntryPermalink></MTRelativeURLBase>
	<a href="<MTArchiveLink relative_url="1">">Link</a>
	<a href="<MTRelativeURL><MTArchiveLink></MTRelativeURL>">Link</a>

=cut

package MTRelativeURL;
use strict;
use MT::Template::Context;
use vars qw($VERSION);
$VERSION = "1.0";

MT::Template::Context->add_tag( RelativeURLVersion => sub { $VERSION } );
MT::Template::Context->add_container_tag( RelativeURLBase => \&MTRelativeURLBase );
MT::Template::Context->add_container_tag( RelativeURL => \&MTRelativeURL );
MT::Template::Context->add_global_filter( relative_url   =>  \&relative_url);

sub MTRelativeURLBase {
    my($ctx, $args, $cond) = @_;
	defined(my $url = $ctx->stash('builder')->build($ctx, $ctx->stash('tokens'), $cond))
		or return;

	return $ctx->error("The specified URL '$url' does not begin with 'http://'")
		unless !$url || $url =~ m|^http://|;

	$ctx->stash('MTRelativeURLBase', $url);
	"";
}

sub MTRelativeURL {
    my($ctx, $args, $cond) = @_;
	my $url = $ctx->stash('builder')->build($ctx, $ctx->stash('tokens'), $cond)
		or return;
	return relative_url($url, $args->{base_url} || 1, $ctx);
}

sub relative_url {
    my($url, $base_url, $ctx) = @_;
	my $blog = $ctx->stash('blog')
		or return $ctx->error("Outside the context of a blog");

	$base_url = $ctx->stash('MTRelativeURLBase') || '' if $base_url eq '1';

	if($base_url =~ m|^http://|) {
		## Try to build relative URI (i.e. "../index.htm")
		my ($base_site, $url_site);
		## Make sure URI is not empty (i.e. "http://www.foo.com" shoul be "http://www.foo.com/"
		$url .= "/" if $url =~ m|^http://[^/]+$|;
		$base_url .= "/" if $base_url =~ m|^http://[^/]+$|;
		## Extract host info (i.e. "http://www.foo.com" or "http://www.foo.com:8080"
		($base_site) = $base_url =~ m|(http://[^/]+)|;
		($url_site) = $url =~ m|(http://[^/]+)|;
		## Make sure url points to same server/port
		return $url if(!$base_site or $base_site ne $url_site);
		## Strip file name of base URL
		$base_url =~ s|[^/]*$||;
		## Convert to path chunks
		my @base = split(/\//, $base_url);
		my @url = split(/\//, $url);
		my $relative = '';
		## Build relative path
		while (1) {
			my ($base_chunk, $url_chunk) = (shift @base, shift @url);
			if(defined $base_chunk) {
				if (!defined $url_chunk) {
					$relative = "../$relative";
				} elsif ($base_chunk ne $url_chunk) {
					$relative .= "/" if $relative;
					$relative = "../$relative$url_chunk";
				}
			} elsif(defined $url_chunk) {
				$relative .= "/" if $relative;
				$relative .= "$url_chunk";
			} else {
				last;
			}
		}
		$url = $relative;
	} else {
		## Use blog's site as base URL and return full URI (i.e. "/journal/index.htm")
		my ($site, $relative);
		($site) = $blog->site_url =~ m|^(http://[^/]+)|;
		($relative) = $url =~ m|^$site(/.*)| if $site;
		$url = $relative if $relative;
	}

	return $url;
}

1;
