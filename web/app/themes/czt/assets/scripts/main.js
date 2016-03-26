/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($, Tween, Timeline) {
  'use strict';

  var
    $document = $(document),
    $window = $(window),
    $body = $('body'),
    $siteWrap = $('.wrap'),
    pageLoaded = false,
    pageLoadCounter = 0,
    ScrollMagicController = new ScrollMagic.Controller(),
    isTouch = detectTouch(),
    transitionEventString = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
    animationEventString = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
    MQ = 0,
    breakpoint = {
      xs: 480,
      sm: 768,
      md: 992,
      lg: 1200
    },

    // Header
    $header = $('.header-main'),
    $headerBar = $('.header-bar'),
    $headerText = $('.header-text'),
    $brand = $('.brand'),
    $headerBtnCont = $('.header-button-container'),
    $headerBtn = $('.header-button'),
    $headerBtnInner = $headerBtn.find('.header-button-inner'),
    $pageProgress = $('.page-progress'),
    headroom,

    // Nav
    $nav = $('.nav-main'),
    $navClose = $('.nav-close'),
    $navOverlay = $('.nav-overlay'),
    $navLinks = $('.nav-menu').find('li'),

    // Main
    $main = $('.content-main'),
    $loader = $('#loader'),

    // Footer
    $footer = $('.footer-main')
  ;

  // User scripts
  var XTN = (function() {

    // Main navigation
    var Nav = (function() {

      function init() {
        $headerBtn.click(show);
        $navClose.click(hide);
        Tween.set($navOverlay, { x: '-50%', y: '-50%' });
        Tween.set([$navClose, $navOverlay], { scale: 0 });
        $nav
          .on('click', function() {
            $navOverlay.click();
          })
          .children().on('click', function(e) {
            e.stopPropagation();
          })
          .find('a').on('click', function(e) {
            hide();
          });
      }

      function show(e) {
        if(e) {
          e.preventDefault();
        }

        _attachEvents();
        _computeOverlay();
        Tween.set($body, {className: '+=noScroll navOpen'});
        // scrolltop fix
        $nav.scrollTop(0);
        // nav links stagger reset
        Tween.killTweensOf($navLinks);
        Tween.set($navLinks, { clearProps: 'all' });

        new Timeline()
          // hide header menu button
          .to($headerBtn, 0.25, { scale: 0 }, 0)
          // show nav overlay
          .to($navOverlay, 0.75, { scale: 1}, 0)
          // show nav close
          .to($navClose, 0.75, { scale: 1, ease: Bounce.easeOut }, 0)
          // show nav content
          .staggerFrom($navLinks, 0.5, {
            opacity: 0,
            scale: 1.1,
            y: -20
          }, 0.1, 0.2);
      }

      function hide(e) {
        if(e) {
          e.preventDefault();
        }

        _detachEvents();
        Tween.set($body, {className: '-=noScroll navOpen'});

        new Timeline()
          // hide nav close and nav overlay
          .to([$navClose, $navOverlay], 0.25, { scale: 0 }, 0)
          // show header menu button
          .to($headerBtn, 0.5, { scale: 1, ease: Bounce.easeOut }, 0);
      }

      function _attachEvents() {
        $window.on('resize', _computeOverlay)
               .on('keydown', _escape);
        $navOverlay.on('click', hide);
      }

      function _detachEvents() {
        $window.off('resize', _computeOverlay)
               .off('keydown', _escape);
        $navOverlay.off('click', hide);
      }

      function _escape(e) {
        e.which == 27 && hide(); // jshint ignore:line
      }

      function _computeOverlay() {
        var overlaySize = Math.max($window.width(), $window.height()) * 3;
        Tween.set($navOverlay, {
          // set button offsets to position overlay
          top: $headerBtnCont.position().top + ($headerBtnCont.height() / 2),
          left: $headerBtnCont.offset().left + ($headerBtnCont.width() / 2),
          // compute size
          width: overlaySize,
          height: overlaySize
        });
      }

      return {
        init: init
      };
    }());

    // Load fonts
    function webFont() {
      function webFontLoad() {
        XTN.pageLoad();
      }
      window.WebFontConfig = {
        google: { families: [ 'Roboto:100,300,400,400italic,700,900:latin' ] },
        active: webFontLoad,
        inactive: webFontLoad
      };
      (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      })();
    }

    // Page load animation
    function pageLoad() {
      pageLoadCounter++;
      if(pageLoadCounter >= 2 && !pageLoaded) {
        $body.removeClass('loading');
        $loader.find('.loader-content')
          .on(transitionEventString, function(e) {
            $loader.hide();
            $(this).off(transitionEventString);
          });
        $window.trigger('trueLoad');
        pageLoaded = true;
      }
    }

    function pageLeave() {
      $('a').not('[href^="https://"]')
          .not('[href^="http://"]')
          .addBack('[href^="https://'+ window.location.host +'"]')
          .addBack('[href^="http://'+ window.location.host +'"]')
          .not('[target]')
        .on('click', function(e) {
          e.preventDefault();
          var nextLink = this.href;
          animatePageLeave();
          setTimeout(function() {
            window.location = nextLink;
          }, 500 + 250);
        });
      function animatePageLeave() {
        $loader.show();
        setTimeout(function() {
          $body.addClass('loading');
        }, 50);
      }
    }

    // Sticky Header
    function stickyHeader() {
      headroom = new Headroom(
        $headerBar.get(0), {
          offset : function() {
            // headroom overrides
            if($('.intro').length) {
              return $window.height() + 300;
            }
            return 300;
          }(),
          tolerance: 5,
          classes : {
            initial : 'header-bar-init',
            pinned : 'header-bar-pinned',
            unpinned : 'header-bar-unpinned',
            top : 'header-bar-top',
            notTop : 'header-bar-not-top'
          }
        }
      );
      headroom.init();
    }

    // Sticky Footer
    function stickyFooter() {
      var contentFooterHeight = $header.outerHeight(true) + $main.outerHeight(true) + $footer.outerHeight(true);
      if(contentFooterHeight <= $window.height()) {
        $footer.addClass('affix');
      } else {
        $footer.removeClass('affix');
      }
    }

    // Header Progress Bar
    function pageProgressBar() {
      var max = $document.height() - $window.height(),
          curr = $window.scrollTop(),
          width = (curr / max * 100) + '%';
      $pageProgress.css({
          width: width
      });
    }

    // GSAP animations
    function commonTweens() {
      // header tweens
      (function() {
        // hovers
        //// Brand hover
        var $spans = $brand.wrapChars().find('span');
        $spans.each(function() {
          var that = $(this);
          that.mouseenter(function() {
            new Timeline()
              .to(that, 0.3, { y: '-50%', ease: Circ.easeOut })
              .to(that, 0.5, { y: '0%', ease: Bounce.easeOut });
          });
        });
        //// Header button hover
        $headerBtn.hover(
          function() {
            new Timeline()
              .to($headerBtnInner, 0.15, {scale: 1.15})
              .to($headerBtnInner, 0.45, {rotationY: 180, ease: Bounce.easeOut });
          },
          function() {
            new Timeline()
              .to($headerBtnInner, 0.15, {scale: 1})
              .to($headerBtnInner, 0.45, {rotationY: 0, ease: Bounce.easeOut });
          }
        );
        //// nav close hover
        Tween.set($navClose, {
          rotation: 45
        });
        $navClose.mouseenter(function() {
          new Timeline()
            .fromTo($navClose, 0.25, { rotation: 45 }, { rotation: '+=90' });
        });
      }());
    }

    // Intro section resize
    function fullPageResize() {
      var $fullPage = $('.full-page');
      if(!$fullPage.length) {
        return;
      }
      $fullPage.height($window.height());
    }

    // Carousel
    function carousel($el, opt) {
      if(!$el.length) {
        return;
      }
      $el.on('init', function() {
        $(this).addClass('loaded');
      }).slick(opt);
    }

    function overlayTap($el) {
      if(!$el.length) {
        return;
      }
      $window.on('resize', attachEvent);
      attachEvent();
      function attachEvent() {
        if(MQ === 0 || MQ === breakpoint.xs || isTouch) {
          $el.children().on('click', overlayTapEvent);
        } else {
          $el.children().off('click', overlayTapEvent).removeClass('tapped');
        }
      }
      function overlayTapEvent(e) {
        var that = $(this);
        if(that.hasClass('tapped')) {
          return;
        }
        e.preventDefault();
        if(!that.data('flag')) {
          that.data('flag', true);
          setTimeout(function(){ that.data('flag', false); }, 100);
          that.closest($el).find('.tapped').not(that).removeClass('tapped');
          that.toggleClass('tapped');
        }
      }
    }

    function smoothScroll() {
      var scrollTime = 1.2,
          scrollDistance = 170;

      $window.on('mousewheel DOMMouseScroll', function(e) {
        var delta = e.originalEvent.wheelDelta/120 || -e.originalEvent.detail/3;
        // trackpad checker (perhaps)
        if(delta % 1 != 0 || delta % 1 == -0) {
          return;
        }
        e.preventDefault();
        var finalScroll = $window.scrollTop() - parseInt(delta * scrollDistance);
        Tween.to($window, scrollTime, {
            scrollTo: { y: finalScroll, autoKill: true },
            ease: Power1.easeOut,
            autoKill: true,
            overwrite: 5
          });
      });
    }

    function updateMediaQuery() {
      MQ = +$('#mq').css('top').replace(/[^-\d\.]/g, '');
    }

    // Revealing module
    return {
      webFont: webFont,
      pageLoad: pageLoad,
      pageLeave: pageLeave,
      stickyHeader: stickyHeader,
      stickyFooter: stickyFooter,
      pageProgressBar: pageProgressBar,
      commonTweens: commonTweens,
      fullPageResize: fullPageResize,
      carousel: carousel,
      overlayTap: overlayTap,
      smoothScroll: smoothScroll,
      updateMediaQuery: updateMediaQuery,
      Nav: Nav
    };
  }());

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Router = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages
        CSSPlugin.defaultForce3D = true;
        FastClick.attach(document.body);
        $('[data-toggle="tooltip"]').tooltip();
        $('<div id="mq"></div>').appendTo($body);
        XTN.webFont();
        XTN.stickyHeader();
        XTN.Nav.init();
        XTN.commonTweens();
        XTN.fullPageResize();
        // XTN.smoothScroll();
        XTN.updateMediaQuery();
        XTN.pageLeave();

        $window
          .on('resize', function() {
            XTN.fullPageResize();
            XTN.updateMediaQuery();
            XTN.stickyFooter();
          })
          .on('load', function() {
            XTN.pageLoad();
          })
          .on('scroll', function() {
            XTN.pageProgressBar();
          });
      },
      finalize: function() {
        XTN.fullPageResize();
        XTN.stickyFooter();

        // Title Lines
        var $titleLines = $('.title-lines');
        if($titleLines.length) {
          $.each($titleLines, function() {
            var $titleLine = $(this);

            var titleLinesTween = new Timeline()
              .from($titleLine.find('.section-title'), 1, { rotationX: 90, ease: Bounce.easeOut })
              .from($titleLine.find('.section-title .before, .section-title .after'), 0.5, { width: 0, ease: Power2.easeOut }, 0.5);

            new ScrollMagic.Scene({
              triggerElement: $titleLine.get(0),
              reverse: false
            }).setTween(titleLinesTween)
              .addTo(ScrollMagicController);
          });
        }
      }
    },
    // Home page
    'home': {
      init: function() {
        ///////////////////
        // intro section //
        ///////////////////

        // start particles.js
        particlesJS('intro-particles', {
          'particles': {
            'number': {
              'value': 100,
              'density': {
                'enable': true,
                'value_area': 800
              }
            },
            'color': {
              'value': '#fff'
            },
            'opacity': {
              'value': 0.5
            },
            'size': {
              'value': 2,
              'random': true
            },
            'line_linked': {
              'enable': true,
              'distance': 150,
              'color': '#eee',
              'opacity': 0.5,
              'width': 1
            },
            'move': {
              'enable': true,
              'speed': 1,
              'direction': 'none',
              'random': true,
              'straight': false,
              'out_mode': 'out',
              'bounce': false
            }
          },
          'interactivity': {
            'detect_on': 'canvas',
            'events': {
              'onhover': {
                'enable': false
              },
              'onclick': {
                'enable': false
              },
              'resize': true
            }
          },
          'retina_detect': true
        });

        // intro parallax
        new ScrollMagic.Scene({
          triggerElement: '#intro-particles',
          triggerHook: 0,
          duration: '100%'
        }).setTween('#intro-particles canvas', { y: '60%', ease: Linear.easeNone })
          .addTo(ScrollMagicController);

        // header-bar tweens
        var headerBarTween = new Timeline()
          .from($headerBar, 1, { backgroundColor: 'rgba(0,0,0,0)', borderBottomColor: 'rgba(0,0,0,0)', boxShadow: 'none', ease: Linear.easeNone }, 0)
          .from([$headerText, $pageProgress], 1, { autoAlpha: 0, opacity: 0, ease: Linear.easeNone }, 0)
          .from($headerBtn.find('.front, .back'), 1, { backgroundColor: '#222', color: '#eee', ease: Linear.easeNone }, 0)
          .from($headerBtn.find('.back span:first-child'), 1, { borderBottomColor: 'rgba(255,255,255,0.5)', ease: Linear.easeNone }, 0)
          .from($headerBtn.find('.icon-bar'), 1, { backgroundColor: '#eee', ease: Linear.easeNone }, 0);

        new ScrollMagic.Scene({
          triggerElement: $('#header-inverse-trigger').get(0),
          triggerHook: 0,
          offset: '-100%',
          duration: $headerBar.height()
        }).setTween(headerBarTween)
          .addTo(ScrollMagicController);
        // end intro section

        // headroomjs fix for intro
        $window
          .on('resize', function() {
            if(headroom) {
              headroom.destroy();
              XTN.stickyHeader();
            }
          });
      },
      finalize: function() {
        // intro text animation
        var $introText = $('.intro');
        var introTextTween = new Timeline()
          .fromTo($introText.find('.divider'), 1, { width: 0 }, { width: '100%', ease: Power2.easeOut })
          .from($introText.find('h1'), 0.75, { opacity: 0, y: '100%', ease: Power2.easeOut })
          .from($introText.find('h2'), 0.75, { opacity: 0, y: '-100%', ease: Power2.easeOut  });

        new ScrollMagic.Scene({
          triggerElement: $introText.get(0)
        }).setTween(introTextTween)
          .addTo(ScrollMagicController);

        ////////////////////
        // other sections //
        ////////////////////

        // about
        var $about = $('.section-about'),
            $aboutBG = $about.find('.bg');

        Tween.set($aboutBG, { opacity: 1 });
        new ScrollMagic.Scene({
          triggerElement: $about.get(0),
          triggerHook: 0.5,
          duration: '40%'
        }).setTween($aboutBG, { opacity: 0, ease: Linear.easeNone })
          .addTo(ScrollMagicController);

        var aboutTween = new Timeline()
          .staggerFrom($('.section-title, p', $about), 1.2, {
            y: 100, opacity: 0, ease: Elastic.easeOut.config(0.5)
          }, 0.2);
        new ScrollMagic.Scene({
          triggerElement: $about.get(0),
          triggerHook: 0
        }).setTween(aboutTween)
          .addTo(ScrollMagicController);
        // end about

        // recent works
        var $recentWorks = $('.section-recent-works'),
            $recentWorkItems = $recentWorks.find('.item-grid');
        var recentWorksTween = new Timeline({
          onComplete: function() {
            Tween.set($recentWorkItems, { clearProps: 'all' });
          }
        }).staggerFrom($recentWorkItems, 1, { scale: 0, opacity: 0, ease: Power2.easeOut }, 0.2)

        new ScrollMagic.Scene({
          triggerElement: $recentWorks.get(0),
          triggerHook: 0
        }).setTween(recentWorksTween)
          .addTo(ScrollMagicController);

        // watermark parallax
        // new ScrollMagic.Scene({
        //   triggerElement: $recentWorks.get(0),
        //   triggerHook: 1,
        //   offset: 50,
        //   duration: function() { return $recentWorks.height(); }
        // }).setTween($recentWorks.find('.text-watermark'), { y: '30%', ease: Linear.easeNone })
        //   .addTo(ScrollMagicController);

        XTN.overlayTap($recentWorks.find('.items-list'));
        // end recent works

        // skills
        var $skills = $('.section-skills'),
            $skillsItems = $skills.find('.spr-skills');

        $skillsItems.sort( function(){ return ( Math.round( Math.random() ) - 0.5 ) } );

        var skillsContentTween = new Timeline()
          .staggerFrom($skills.find('.items-title'), 1, { x: -500 }, 0.25, 0)
          .staggerFrom($skillsItems, 0.5, { scale: 0, ease: Back.easeOut.config(2) }, 0.08, 0.5)

        new ScrollMagic.Scene({
          triggerElement: $skills.get(0),
          triggerHook: 0,
          reverse: false
        }).setTween(skillsContentTween)
          .addTo(ScrollMagicController);
        // end skills
      }
    },
    'contact': {
      init: function() {
        $('.form-contact').materialLabels();
      },
      finalize: function() {
        Tween.staggerFrom($('.list-social li'), 1.2, {
            y: 100, opacity: 0, ease: Elastic.easeOut.config(0.35)
          }, 0.2);
      }
    },
    'portfolio': {
      init: function() {
      },
      finalize: function() {
        var $portList = $('.portfolio-list');
        var portListTween = new Timeline()
          .staggerFrom($portList.find('.item'), 1.2, {
            y: 100, opacity: 0, ease: Elastic.easeOut.config(0.5)
          }, 0.2);

        new ScrollMagic.Scene({
          triggerElement: $portList.get(0),
          reverse: false
        }).setTween(portListTween)
          .addTo(ScrollMagicController);
      }
    },
    'single_portfolio': {
      init: function() {
      },
      finalize: function() {
        XTN.carousel($('.portfolio-carousel'), {
          autoplay: true,
          dots: true,
          prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">' +
            '<i class="fa fa-angle-left"></i><span class="sr-only">Previous</span>' +
            '</button>',
          nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">' +
            '<i class="fa fa-angle-right"></i><span class="sr-only">Next</span>' +
            '</button>'
        });

        var $portContent = $('.portfolio-content');
        var skillsContentTween = new Timeline()
          .from($portContent.find('.col-sm-7'), 0.75, { x: -800, opacity: 0, ease: Power2.easeOut }, 0)
          .from($portContent.find('.col-sm-4'), 0.75, { x: 800, opacity: 0, ease: Power2.easeOut }, 0)

        new ScrollMagic.Scene({
          triggerElement: $portContent.get(0),
          reverse: false
        }).setTween(skillsContentTween)
          .addTo(ScrollMagicController);
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Router;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        $window.on('trueLoad', function() {
          UTIL.fire(classnm, 'finalize');
        });
      });

      // Fire common finalize JS
      $window.on('trueLoad', function() {
        UTIL.fire('common', 'finalize');
      });
    }
  };

  // Utils
  $.fn.wrapChars = function() {
    return this.each(function() {
      $(this).html(function(i, html) {
        return html.trim().replace(/ /g, '\u00a0').replace(/(.)/g, '<span>$1</span>');
      });
    });
  }

  $.fn.materialLabels = function() {
    return this.each(function() {
      $(this).find('input, textarea')
        .on('input focus blur', function(e) {
          var that = $(this),
              $parent = that.closest('.form-group');
          if(e.type === 'input') {
            if(that.val()) { $parent.addClass('has-input'); }
            else { $parent.removeClass('has-input'); }
          }
          if(e.type === 'focus') { $parent.addClass('has-focus'); }
          if(e.type === 'blur') { $parent.removeClass('has-focus'); }
        }).trigger('input')
    });
  }

  function randomNumber(min, max){
    return Math.floor(Math.random() * (1 + max - min) + min);
  }
  function rangeToPercent(number, min, max){
    return ((number - min) / (max - min));
  }
  // http://stackoverflow.com/a/4819886
  function detectTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }

  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   */
  Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if ( i !== 0 ) {
      while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
      }
    }
    return this;
  }

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery, TweenMax, TimelineMax); // Fully reference libraries after this point.
