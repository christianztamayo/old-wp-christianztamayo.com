<?php while (have_posts()) : the_post(); ?>
  <?php
    // vars
    $fields         = get_post_meta($post->ID);
    $url            = isset($fields['url'][0]) ? $fields['url'][0] : null;
    $button_text    = isset($fields['button_text'][0]) ? $fields['button_text'][0] : null;
    $title_stylized = isset($fields['title_stylized'][0]) ? $fields['title_stylized'][0] : null;
    $launch_date    = isset($fields['launch_date'][0]) ? $fields['launch_date'][0] : null;
    $client         = isset($fields['client'][0]) ? $fields['client'][0] : null;
    $categories     = get_the_category();
    $images_small   = isset($fields['images_small']) ? $fields['images_small'] : null;
    $images_large   = isset($fields['images_large']) ? $fields['images_large'] : null;
  ?>
  <article <?php post_class('section-portfolio-inner'); ?>>
    <?php // Carousel Section ?>
    <?php if($images_small !== false && $images_large !== false): ?>
      <section class="portfolio-carousel">
        <?php foreach ($images_small as $key => $value): ?>
          <?php if(!isset($images_large[$key])) continue; ?>
          <div>
            <picture>
              <!--[if IE 9]><video style="display: none;"><![endif]-->
              <source srcset="<?= wp_get_attachment_url($images_large[$key]) ?>" media="(min-width: 768px)">
              <!--[if IE 9]></video><![endif]-->
              <img srcset="<?= wp_get_attachment_url($value) ?>" alt="">
            </picture>
          </div>
        <?php endforeach; ?>
      </section>
    <?php endif; ?>
    <?php // Content Section ?>
    <section class="portfolio-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-7">
            <header>
              <h1 class="entry-title section-title title-default">
                <?= $title_stylized ?>
              </h1>
            </header>
            <div class="entry-content">
              <?php the_content(); ?>
            </div>
          </div>
          <div class="col-sm-4 col-sm-offset-1">
            <?php if($url): ?>
              <div class="portfolio-link">
                <a target="_blank" href="<?= $url ?>" class="btn btn-primary btn-block btn-lg btn btn-icon">
                  <span><?= $button_text ?></span>
                  <i class="fa fa-lg fa-chevron-right"></i>
                </a>
              </div>
            <?php endif; ?>
            <ul class="portfolio-details">
              <?php if($launch_date && $launch_date !== '0000-00-00'): ?>
                <li>
                  <h3 class="h5">Date</h3>
                  <p><?= date('F Y', strtotime($launch_date)) ?></p>
                </li>
              <?php endif; ?>
              <?php if($client): ?>
                <li>
                  <h3 class="h5">Client</h3>
                  <p><?= $client ?></p>
                </li>
              <?php endif; ?>
              <?php if($categories): ?>
                <li>
                  <h3 class="h5">Categories</h3>
                  <p>
                    <?php foreach($categories as $key => $category): ?>
                      <?php
                        echo $category->name;
                        if(($key + 1) < sizeof($categories)) {
                          echo ', ';
                        }
                      ?>
                    <?php endforeach; ?>
                  </p>
                </li>
              <?php endif; ?>
              <?php if($url): ?>
                <li>
                  <h3 class="h5">URL</h3>
                  <p>
                    <a target="_blank" href="<?= $url ?>">
                      <?= $url ?>
                    </a>
                  </p>
                </li>
              <?php endif; ?>
            </ul>
          </div>
        </div>
        <p class="view-other-works">
          <a href="/portfolio/">View Other Works</a>
        </p>
        <?php /*
          <footer>
            <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
          </footer>
          <?php comments_template('/templates/comments.php'); ?>
        */ ?>
      </div>
    </section>
  </article>
<?php endwhile; ?>
