<?php

namespace Roots\Sage\Setup;

use Roots\Sage\Assets;

/**
 * Theme setup
 */
function setup() {
  // Enable features from Soil when plugin is activated
  // https://roots.io/plugins/soil/
  add_theme_support('soiled-clean-up'); // Cleaner WordPress markup
  add_theme_support('soiled-disable-asset-versioning'); // Disable asset versioning
  add_theme_support('soiled-disable-trackbacks'); // Disable trackbacks
  add_theme_support('soiled-google-analytics', 'UA-34299324-5'); // Google Analytics (more info)
  add_theme_support('soiled-jquery-cdn'); // Load jQuery from the jQuery CDN
  // add_theme_support('soiled-js-to-footer'); // Move all JS to the footer
  add_theme_support('soiled-nav-walker'); // Cleaner walker for navigation menus
  add_theme_support('soiled-nice-search'); // Convert search results from /?s=query to /search/query/
  add_theme_support('soiled-relative-urls'); // Root relative URLs

  // Make theme available for translation
  // Community translations can be found at https://github.com/roots/sage-translations
  load_theme_textdomain('sage', get_template_directory() . '/lang');

  // Enable plugins to manage the document title
  // http://codex.wordpress.org/Function_Reference/add_theme_support#Title_Tag
  add_theme_support('title-tag');

  // Register wp_nav_menu() menus
  // http://codex.wordpress.org/Function_Reference/register_nav_menus
  register_nav_menus([
    'primary_navigation' => __('Primary Navigation', 'sage')
  ]);

  // Enable post thumbnails
  // http://codex.wordpress.org/Post_Thumbnails
  // http://codex.wordpress.org/Function_Reference/set_post_thumbnail_size
  // http://codex.wordpress.org/Function_Reference/add_image_size
  add_theme_support('post-thumbnails');

  // Enable post formats
  // http://codex.wordpress.org/Post_Formats
  // add_theme_support('post-formats', ['aside', 'gallery', 'link', 'image', 'quote', 'video', 'audio']);

  // Enable HTML5 markup support
  // http://codex.wordpress.org/Function_Reference/add_theme_support#HTML5
  add_theme_support('html5', ['caption', 'comment-form', 'comment-list', 'gallery', 'search-form']);

  // Use main stylesheet for visual editor
  // To add custom styles edit /assets/styles/layouts/_tinymce.scss
  add_editor_style(Assets\asset_path('styles/main.css'));

  // Disable built-in responsive images
  add_filter('wp_calculate_image_srcset_meta', '__return_null');

  // Disable wpautop
  remove_filter('the_content', 'wpautop');
  remove_filter('the_excerpt', 'wpautop');

  // Disable search and archive
  function disable_search($query, $error = true) {
    if (is_search() || is_archive() ) {
      if (is_search()) {
        $query->is_search = false;
        $query->query_vars['s'] = false;
        $query->query['s'] = false;
      }
      if (is_archive()) {
        $query->is_archive = false;
      }
      // to error
      if ($error == true) {
        $query->is_404 = true;
      }
    }
  }
  add_action('parse_query', __NAMESPACE__ . '\\disable_search');
  add_filter('get_search_form', '__return_null');
}
add_action('after_setup_theme', __NAMESPACE__ . '\\setup');

/**
 * Register sidebars
 */
function widgets_init() {
  register_sidebar([
    'name'          => __('Primary', 'sage'),
    'id'            => 'sidebar-primary',
    'before_widget' => '<section class="widget %1$s %2$s">',
    'after_widget'  => '</section>',
    'before_title'  => '<h3>',
    'after_title'   => '</h3>'
  ]);

  register_sidebar([
    'name'          => __('Footer', 'sage'),
    'id'            => 'sidebar-footer',
    'before_widget' => '<section class="widget %1$s %2$s">',
    'after_widget'  => '</section>',
    'before_title'  => '<h3>',
    'after_title'   => '</h3>'
  ]);
}
add_action('widgets_init', __NAMESPACE__ . '\\widgets_init');

/**
 * Determine which pages should NOT display the sidebar
 */
function display_sidebar() {
  static $display;

  isset($display) || $display = !in_array(true, [
    // The sidebar will NOT be displayed if ANY of the following return true.
    // @link https://codex.wordpress.org/Conditional_Tags
    // is_404(),
    // is_front_page(),
    // is_page_template('template-custom.php'),
    true
  ]);

  return apply_filters('sage/display_sidebar', $display);
}

/**
 * Determine which pages should wrap inside .container-fluid
 */
function has_wrap() {
  static $display;

  isset($display) || $display = !in_array(true, [
    // The page will NOT be wrapped if ANY of the following return true.
    // @link https://codex.wordpress.org/Conditional_Tags
    // is_404(),
    is_front_page(),
    is_singular('work'),
    // is_page_template('template-custom.php'),
  ]);

  return apply_filters('sage/has_wrap', $display);
}

/**
 * Theme assets
 */
function assets() {
  // contact form 7 assets cleanup
  wp_deregister_script('jquery-form');
  wp_deregister_script('contact-form-7');
  wp_deregister_style('contact-form-7');
  wp_enqueue_script('contact-form-7', wpcf7_plugin_url('includes/js/scripts.js'), ['sage/js'], WPCF7_VERSION, true);

  wp_enqueue_style('sage/css', Assets\asset_path('styles/main.css'), false, null);
  wp_enqueue_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', false, null);

  if (is_single() && comments_open() && get_option('thread_comments')) {
    wp_enqueue_script('comment-reply');
  }

  wp_enqueue_script('sage/js', Assets\asset_path('scripts/main.js'), ['jquery'], null, true);
  wp_enqueue_script('html5shiv-respond', Assets\asset_path('scripts/html5shiv-respond.js'), [], null);
  wp_script_add_data('html5shiv-respond', 'conditional', 'lt IE 9');
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\assets', 100);
