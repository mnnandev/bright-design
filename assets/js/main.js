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

  function initFaqPage() {
    var $page = $('.faq-page');
    if (!$page.length) return;

    var $accordion = $('#faq-accordion');
    var $items = $accordion.find('.faq-item');
    var $topics = $('.faq-topic');
    var $search = $('#faq-search-input');
    var $empty = $('#faq-empty');
    var activeTopic = 'about';
    var topicFilterEnabled = false;

    function itemMatchesTopic($item, topic) {
      var topics = ($item.attr('data-faq-topic') || '').split(/\s+/);
      return topics.indexOf(topic) !== -1;
    }

    function itemMatchesSearch($item, query) {
      if (!query) return true;
      return $item.text().toLowerCase().indexOf(query) !== -1;
    }

    function updateVisibility() {
      var query = ($search.val() || '').trim().toLowerCase();
      var visibleCount = 0;

      $items.each(function () {
        var $item = $(this);
        var topicMatch = !topicFilterEnabled || itemMatchesTopic($item, activeTopic);
        var searchMatch = itemMatchesSearch($item, query);
        var show = topicMatch && searchMatch;
        $item.toggle(show);
        if (show) visibleCount += 1;
      });

      $empty.prop('hidden', visibleCount > 0);
    }

    $accordion.on('click', '.faq-item__trigger', function () {
      var $item = $(this).closest('.faq-item');
      var isOpen = $item.hasClass('is-open');

      if (isOpen) {
        $item.removeClass('is-open');
        $(this).attr('aria-expanded', 'false');
        return;
      }

      $items.not($item).each(function () {
        var $other = $(this);
        $other.removeClass('is-open');
        $other.find('.faq-item__trigger').attr('aria-expanded', 'false');
      });

      $item.addClass('is-open');
      $(this).attr('aria-expanded', 'true');
    });

    $topics.on('click', function () {
      activeTopic = $(this).attr('data-faq-topic');
      topicFilterEnabled = true;
      $topics.removeClass('is-active').attr('aria-selected', 'false');
      $(this).addClass('is-active').attr('aria-selected', 'true');
      updateVisibility();
    });

    $search.on('input', updateVisibility);
    updateVisibility();
  }

  function initMediaPolicyPage() {
    var $page = $('.media-policy-page');
    if (!$page.length) return;

    var $navLinks = $('.media-policy-nav__link');
    var $sections = $('[data-media-section]');
    var $main = $('.media-policy-main');
    var $sidebar = $('.media-policy-sidebar');
    var $panel = $('.media-policy-sidebar__sticky');
    var $content = $('.media-policy-content');
    var desktopMq = window.matchMedia('(min-width: 1025px)');
    var scrollOffset = 120;
    var observer;
    var sidebarMetrics = {
      width: 0,
      left: 0,
      top: 32,
    };

    function readStickyTop() {
      return Math.round(Math.min(Math.max(window.innerWidth * 0.025, 20), 32));
    }

    function resetSidebarPosition() {
      $sidebar.removeClass('is-fixed is-at-bottom');
      $panel.css({ width: '', left: '' });
      $sidebar.css('min-height', '');
    }

    function measureSidebar() {
      resetSidebarPosition();
      if (!desktopMq.matches || !$sidebar.length) return;

      sidebarMetrics.top = readStickyTop();
      sidebarMetrics.width = $sidebar.outerWidth();
      sidebarMetrics.left = $sidebar.offset().left;
      $sidebar.css('min-height', $content.outerHeight());
    }

    function updateSidebarPosition() {
      if (!desktopMq.matches || !$main.length || !$sidebar.length || !$panel.length) {
        resetSidebarPosition();
        return;
      }

      var scrollTop = $(window).scrollTop();
      var mainTop = $main.offset().top;
      var mainHeight = $main.outerHeight();
      var panelHeight = $panel.outerHeight();
      var startFix = mainTop - sidebarMetrics.top;
      var endFix = mainTop + mainHeight - panelHeight - sidebarMetrics.top;

      if (scrollTop <= startFix) {
        $sidebar.removeClass('is-fixed is-at-bottom');
        $panel.css({ width: '', left: '' });
        return;
      }

      if (scrollTop >= endFix) {
        $sidebar.removeClass('is-fixed').addClass('is-at-bottom');
        $panel.css({ width: sidebarMetrics.width, left: '' });
        return;
      }

      $sidebar.addClass('is-fixed').removeClass('is-at-bottom');
      $panel.css({
        width: sidebarMetrics.width,
        left: sidebarMetrics.left,
      });
    }

    function refreshSidebarLayout() {
      measureSidebar();
      updateSidebarPosition();
    }

    $navLinks.on('click', function (event) {
      event.preventDefault();
      var targetId = $(this).attr('href');
      var $target = $(targetId);

      if (!$target.length) return;

      $('html, body').animate(
        {
          scrollTop: $target.offset().top - scrollOffset,
        },
        420
      );
    });

    function setActiveSection(id) {
      if (!id) return;
      $navLinks.removeClass('is-active');
      $navLinks.filter('[href="#' + id + '"]').addClass('is-active');
    }

    if ('IntersectionObserver' in window && $sections.length) {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          root: null,
          rootMargin: '-25% 0px -55% 0px',
          threshold: 0,
        }
      );

      $sections.each(function () {
        observer.observe(this);
      });
    }

    refreshSidebarLayout();

    $(window).on('scroll.mediaPolicySidebar', updateSidebarPosition);
    $(window).on('resize.mediaPolicySidebar load.mediaPolicySidebar', refreshSidebarLayout);

    if (typeof desktopMq.addEventListener === 'function') {
      desktopMq.addEventListener('change', refreshSidebarLayout);
    } else if (typeof desktopMq.addListener === 'function') {
      desktopMq.addListener(refreshSidebarLayout);
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
    initFaqPage();
    initMediaPolicyPage();
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
