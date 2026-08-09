/**
 * Static include system — fetches shared partials into placeholders.
 * Usage on every page:
 *   <div id="header"></div>
 *   <div id="footer"></div>
 *   <script src="assets/js/include.js"></script>
 *
 * Path is resolved relative to the current HTML file so pages in the
 * project root can share includes/ without a build step.
 *
 * Note: fetch() is blocked on file:// — preview with a local server
 * (e.g. npx serve . or VS Code Live Server).
 */
(function () {
  function resolveIncludePath(file) {
    return new URL('includes/' + file, window.location.href).href;
  }

  function inject(selector, html) {
    var el = document.querySelector(selector);
    if (!el) return;

    var temp = document.createElement('div');
    temp.innerHTML = html;

    // Hoist <link> / <style> from partials into <head> (e.g. Google Fonts)
    Array.prototype.slice
      .call(temp.querySelectorAll('link[rel], style'))
      .forEach(function (node) {
        document.head.appendChild(node);
      });

    var frag = document.createDocumentFragment();
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    el.parentNode.replaceChild(frag, el);
  }

  function loadPartial(file, selector) {
    return fetch(resolveIncludePath(file))
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Failed to load ' + file + ' (' + res.status + ')');
        }
        return res.text();
      })
      .then(function (html) {
        inject(selector, html);
      });
  }

  function boot() {
    return Promise.all([
      loadPartial('header.html', '#header'),
      loadPartial('footer.html', '#footer'),
    ])
      .then(function () {
        document.dispatchEvent(new CustomEvent('includes:loaded'));
      })
      .catch(function (err) {
        console.error('[include.js]', err);
        console.warn(
          'Header/footer includes need a local server (fetch is blocked on file://). Try: npx serve .'
        );
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
