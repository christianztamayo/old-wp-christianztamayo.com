<?php

namespace Roots\Soiled\RelativeURLs;

use Roots\Soiled\Utils;

/**
 * Root relative URLs
 *
 * WordPress likes to use absolute URLs on everything - let's clean that up.
 * Inspired by http://www.456bereastreet.com/archive/201010/how_to_make_wordpress_urls_root_relative/
 *
 * You can enable/disable this feature in functions.php (or lib/setup.php if you're using Sage):
 * add_theme_support('soiled-relative-urls');
 */

if (is_admin() || isset($_GET['sitemap']) || in_array($GLOBALS['pagenow'], ['wp-login.php', 'wp-register.php'])) {
  return;
}

$root_rel_filters = apply_filters('soiled/relative-url-filters', [
  'bloginfo_url',
  'the_permalink',
  'wp_list_pages',
  'wp_list_categories',
  'wp_get_attachment_url',
  'the_content_more_link',
  'the_tags',
  'get_pagenum_link',
  'get_comment_link',
  'month_link',
  'day_link',
  'year_link',
  'term_link',
  'the_author_posts_link',
  'script_loader_src',
  'style_loader_src'
]);
Utils\add_filters($root_rel_filters, 'Roots\\Soiled\\Utils\\root_relative_url');
