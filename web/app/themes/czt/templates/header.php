<header class="header-main">
  <?php if(is_front_page()): ?>
    <div class="intro full-page">
      <div id="intro-particles"></div>
      <div id="header-inverse-trigger"></div>
      <div class="intro-content">
        <div class="intro-text">
          <div class="ovh">
            <h1><?php echo get_bloginfo('title') ?></h1>
          </div>
          <div class="divider"></div>
          <div class="ovh">
            <h2>
              <?php echo get_bloginfo('description') ?><span class="blinking-cursor">_</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  <?php endif; ?>
  <div class="header-bar">
    <div class="container-fluid">
      <div class="header-text">
        <h1>
          <a class="brand" href="<?= esc_url(home_url('/')); ?>">
            CZT
          </a>
        </h1>
        <h2>
          <?php echo get_bloginfo('description') ?><span class="blinking-cursor">_</span>
        </h2>
      </div>
      <div class="flex-push"></div>
      <div class="header-button-container">
        <button type="button" class="header-button btn">
          <div class="header-button-inner">
            <div class="front">
              <span class="icon-bars">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </span>
            </div>
            <div class="back">
              <span>Me</span><span>nu</span>
            </div>
          </div>
        </button>
      </div>
    </div>
    <div class="page-progress"></div>
  </div>
</header>
<div class="nav-overlay"></div>
<nav class="nav-main">
  <div class="container-fluid">
    <button type="button" class="nav-close btn">
      <span class="icon-bars">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </span>
      <span class="sr-only">Close Menu</span>
    </button>
    <?php
      if (has_nav_menu('primary_navigation')) :
        wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav-menu']);
      endif;
    ?>
  </div>
</nav>
