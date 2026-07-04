# Portfolio Starter

A single-page portfolio built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

## Run it locally

1. Open the `portfolio` folder in VS Code.
2. Install the **Live Server** extension (Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.

(Or just double-click `index.html` to open it directly in a browser — everything except the resume download link will work.)

## What's in here

```
portfolio/
├── index.html        ← all content lives here
├── css/style.css      ← all styling, theme, layout, responsive rules
├── js/script.js        ← mobile nav, theme toggle, scroll effects, form validation
├── assets/            ← put resume.pdf here
└── images/             ← put real project screenshots here (optional)
```

## Things to customize

- **Everywhere you see bracketed text** like `[Your City, Country]` or "Your Name" — replace with your real details.
- **Hero / About / Skills / Experience** — edit directly in `index.html`, they're plain text and lists.
- **Projects** — each `<article class="project">` block is one project card. Duplicate the block to add more, delete to remove. Replace the placeholder gradient thumbnails with real screenshots by swapping `<div class="project__thumb ...">` for an `<img>` tag once you have images in `/images`.
- **Résumé** — drop your PDF at `assets/resume.pdf` (the download button already points there).
- **Contact form** — currently client-side only (validates input, shows a message, doesn't send anywhere). To actually receive submissions, either:
  - Use [Formspree](https://formspree.io) — add `action="https://formspree.io/f/yourFormId"` and `method="POST"` to the `<form>` tag and you can remove the JS `preventDefault` flow, or
  - Use [EmailJS](https://www.emailjs.com) from the browser, or
  - Point it at your own backend endpoint with `fetch()`.
- **Colors / fonts** — all defined as CSS variables at the top of `css/style.css` under `:root` and `[data-theme='dark']`. Change them there and the whole site updates.

## Deploy it for free

- **GitHub Pages**: push this folder to a GitHub repo → Settings → Pages → set source to `main` branch.
- **Netlify** or **Vercel**: drag-and-drop the folder onto their dashboard, or connect the GitHub repo.

## Notes

- Dark/light mode follows the visitor's OS setting by default and can be toggled with the sun/moon icon (resets on page reload — add `localStorage` yourself if you want it to persist, see comment in `script.js`).
- Uses `color-mix()` in a few places (CSS), which needs a fairly recent browser (Chrome/Edge 111+, Safari 16.2+, Firefox 113+). If you need to support older browsers, replace those with plain hex/rgba values.
