/**
 * Site-wide interactions (mobile menu, sliders, etc.)
 * Runs after header/footer are injected via include.js.
 */
(function ($) {
  'use strict';

  function initMobileMenu() {
    var $toggle = $('[data-menu-toggle]');
    var $menu = $('[data-mobile-menu]');

    if (!$toggle.length || !$menu.length) return;

    $toggle.on('click', function () {
      var isOpen = $menu.attr('aria-hidden') === 'false';
      var nextOpen = !isOpen;
      $menu.attr('aria-hidden', nextOpen ? 'false' : 'true');
      $toggle.attr('aria-expanded', nextOpen ? 'true' : 'false');
      $toggle.attr('aria-label', nextOpen ? 'Close menu' : 'Open menu');
      $('body').toggleClass('menu-open', nextOpen);
    });
  }

  function initNavActiveState() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    $('.site-nav a[href], .mobile-menu a[href]').each(function () {
      var href = $(this).attr('href');
      if (href === path || (path === '' && href === 'index.html')) {
        $(this).addClass('is-active');
      }
    });
  }

  function init() {
    initMobileMenu();
    initNavActiveState();
  }

  $(function () {
    // Partials may still be loading — wait for include.js signal
    if (document.querySelector('#header') || document.querySelector('#footer')) {
      $(document).one('includes:loaded', init);
    } else {
      init();
    }
  });
})(jQuery);
