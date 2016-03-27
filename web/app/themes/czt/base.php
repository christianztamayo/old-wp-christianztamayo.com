<?php

use Roots\Sage\Setup;
use Roots\Sage\Wrapper;

?><!doctype html>
<html <?php language_attributes(); ?>>
  <?php get_template_part('templates/head'); ?>
  <body <?php body_class(); ?>>
    <!--[if IE]>
      <div class="alert alert-warning">
        <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'sage'); ?>
      </div>
    <![endif]-->
    <div class="wrap">
      <?php
        do_action('get_header');
        get_template_part('templates/header');
      ?>
      <div class="content" role="document">
        <main class="content-main" role="main">
          <?php if (Setup\has_wrap()) : ?><div class="container-fluid"><?php endif; ?>
            <?php include Wrapper\template_path(); ?>
          <?php if (Setup\has_wrap()) : ?></div><?php endif; ?>
        </main>
        <?php if (Setup\display_sidebar()) : ?>
          <aside class="sidebar">
            <?php include Wrapper\sidebar_path(); ?>
          </aside>
        <?php endif; ?>
      </div>
      <?php
        do_action('get_footer');
        get_template_part('templates/footer');
      ?>
    </div>
    <div id="loader" class="loader">
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-me">
          CZT <span>CZT</span>
        </div>
      </div>
    </div>
    <?php wp_footer(); ?>
  </body>
</html>
