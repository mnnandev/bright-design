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

  function pageSlug(value) {
    if (!value) return 'index';

    var segment = String(value).split('/').pop() || '';
    segment = segment.split('?')[0].split('#')[0].toLowerCase();

    if (!segment || segment === '/') return 'index';

    segment = segment.replace(/\.html$/i, '');
    return segment || 'index';
  }

  function linkSlug(href) {
    if (!href || href.charAt(0) === '#') return '';

    try {
      return pageSlug(new URL(href, window.location.href).pathname);
    } catch (err) {
      return pageSlug(href);
    }
  }

  function initNavActiveState() {
    var current = pageSlug(window.location.pathname);

    $('.site-nav a[href], .mobile-menu a[href]').each(function () {
      var $link = $(this);
      var href = $link.attr('href');

      if (linkSlug(href) === current) {
        $link.addClass('is-active').attr('aria-current', 'page');
      }
    });
  }

  function init() {
    initMobileMenu();
    initNavActiveState();
  }

  function whenIncludesReady(callback) {
    if (document.querySelector('.site-header') || window.__includesReady) {
      callback();
      return;
    }

    document.addEventListener('includes:loaded', callback, { once: true });
  }

  $(function () {
    whenIncludesReady(init);
  });
})(jQuery);
