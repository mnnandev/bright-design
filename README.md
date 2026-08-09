# Bright Dreamers Club — Static Site

Plain **HTML / CSS / JS** site for **Bright Dreamers Club** (jQuery via CDN). No npm, no build step — structured for a later WordPress theme conversion.

## Preview locally

Header/footer are loaded with `fetch()`, which browsers block on `file://`. Serve the project root with any static server:

```bash
npx serve .
```

Or use the **VS Code / Cursor Live Server** extension (or `python -m http.server 5500`, etc.).

No `npm install` or CSS build is required.

## File structure

```
├── index.html
├── about.html
├── explore.html
├── program-single.html
├── for-parents.html
├── get-involved.html
├── partners.html
├── events.html
├── contact.html
├── faq.html
├── privacy-policy.html
├── terms.html
├── cookie-policy.html
├── assets/
│   ├── css/
│   │   └── style.css          # Plain CSS + design tokens
│   ├── js/
│   │   ├── include.js         # Loads shared header/footer
│   │   └── main.js            # jQuery interactions
│   └── fonts/                 # Optional self-hosted fonts
├── includes/
│   ├── header.html            # Shared header + Google Fonts
│   └── footer.html            # Shared footer
└── README.md
```

## Header / footer include system

Every page has:

```html
<div id="header"></div>
<!-- page content -->
<div id="footer"></div>
<script src="assets/js/include.js"></script>
```

`assets/js/include.js` fetches `includes/header.html` and `includes/footer.html` and injects them. Edit those files once — all pages update.

Google Fonts (Bitter + Outfit) live in `includes/header.html`; `include.js` moves those `<link>` tags into `<head>`.

After includes load, an `includes:loaded` event fires so `main.js` can wire mobile menu / nav state.

## Working in parallel

| Edit this… | When you need to… |
|---|---|
| Your page `.html` only | Build a page’s sections |
| `includes/header.html` / `footer.html` | Change global nav/footer/fonts |
| `assets/css/style.css` | Shared tokens, layout, components |
| `assets/js/main.js` | Site-wide JS behavior |

## Design tokens (DevTools-friendly)

In `assets/css/style.css` on `:root`:

- `--color-pink` / `--color-navy`
- `--font-heading` (Bitter) / `--font-body` (Outfit)
- `--container-max-width` (1650px) / `--container-padding` (72px → 32px tablet → 20px mobile)
- `--card-shadow`

Use `.site-container` for content width and `.section-padding` for vertical rhythm. Tweak variables on `<html>` in DevTools to adjust the whole site.

## Scripts on every page

1. `assets/css/style.css`
2. jQuery 3.7.1 CDN
3. `assets/js/include.js`
4. `assets/js/main.js`
