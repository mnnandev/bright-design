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
    var exploreSubpages = ['creative-makers', 'young-ideas-lab', 'create-for-cause', 'community-adventures'];

    $('.site-nav a[href], .mobile-menu a[href]').each(function () {
      var $link = $(this);
      var href = $link.attr('href');

      if (linkSlug(href) === current) {
        $link.addClass('is-active').attr('aria-current', 'page');
      }
    });

    if (exploreSubpages.indexOf(current) !== -1) {
      $(
        '.site-nav__item--dropdown > .nav-link[href="explore.html"], .mobile-menu__group > a[href="explore.html"]'
      ).addClass('is-active');
    }
  }

  function initApplySelects() {
    $('[data-apply-select]').each(function () {
      var $wrap = $(this);
      if ($wrap.data('applySelectInit')) return;

      var $native = $wrap.find('.apply-select__native');
      var $trigger = $wrap.find('.apply-select__trigger');
      var $value = $wrap.find('.apply-select__value');
      var $menu = $wrap.find('.apply-select__menu');
      var $options = $wrap.find('.apply-select__option');
      var placeholder = $native.find('option:disabled').first().text() || 'Select';

      if (!$options.length) {
        $menu.empty();
        $native.find('option').each(function () {
          var $opt = $(this);
          var val = $opt.attr('value');

          if ($opt.is(':disabled') || val === '') return;

          $('<li><button type="button" class="apply-select__option" role="option"></button></li>')
            .find('button')
            .attr('data-value', val)
            .text($.trim($opt.text()))
            .end()
            .appendTo($menu);
        });
        $options = $wrap.find('.apply-select__option');
      }

      function closeMenu() {
        $wrap.removeClass('is-open');
        $trigger.attr('aria-expanded', 'false');
        $menu.prop('hidden', true);
      }

      function openMenu() {
        $wrap.addClass('is-open');
        $trigger.attr('aria-expanded', 'true');
        $menu.prop('hidden', false);
      }

      function setValue(nextValue, label) {
        $native.val(nextValue).trigger('change');
        $value.text(label).toggleClass('is-placeholder', !nextValue);
        $options.removeClass('is-selected').filter('[data-value="' + nextValue + '"]').addClass('is-selected');
        $options.attr('aria-selected', 'false');
        $options.filter('[data-value="' + nextValue + '"]').attr('aria-selected', 'true');
      }

      $trigger.on('click', function () {
        if ($wrap.hasClass('is-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      $options.on('click', function () {
        var $option = $(this);
        setValue($option.data('value'), $.trim($option.text()));
        closeMenu();
        $trigger.trigger('focus');
      });

      $(document).on('click.applySelect', function (event) {
        if (!$wrap.is(event.target) && $wrap.has(event.target).length === 0) {
          closeMenu();
        }
      });

      $(document).on('keydown.applySelect', function (event) {
        if (event.key === 'Escape') {
          closeMenu();
        }
      });

      $native.on('invalid', function () {
        $trigger.trigger('focus');
      });

      if (!$native.val()) {
        $value.text(placeholder).addClass('is-placeholder');
      }

      $wrap.data('applySelectInit', true);
    });
  }

  function init() {
    initMobileMenu();
    initNavActiveState();
    initApplySelects();
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
