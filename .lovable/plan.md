
## Fix 404 on GitHub Pages — Switch to HashRouter

### Root Cause

GitHub Pages serves static files only. When a user visits `https://cheeseupwax.github.io/cheeseup/`, the server correctly returns `index.html`. However, `BrowserRouter` uses the HTML5 History API (e.g., `/cheeseup/some-page`), and GitHub Pages has no server-side rule to rewrite those paths back to `index.html` — so they return a 404.

`HashRouter` puts the route after a `#` (e.g., `https://cheeseupwax.github.io/cheeseup/#/`), which is never sent to the server — the browser handles it entirely. This is the standard, reliable fix for SPAs on GitHub Pages.

---

### Change Required

**File: `src/App.tsx`** — one line change:

Replace `BrowserRouter` with `HashRouter`:

```tsx
// Before
import { BrowserRouter, Routes, Route } from "react-router-dom";
<BrowserRouter>...</BrowserRouter>

// After
import { HashRouter, Routes, Route } from "react-router-dom";
<HashRouter>...</HashRouter>
```

No other files need changing. The `base: '/cheeseup/'` in `vite.config.ts` and the GitHub Actions workflow are both correct and can stay as-is.

---

### After This Change

Once pushed to `main`, GitHub Actions will automatically rebuild and redeploy. The site will load at:

**`https://cheeseupwax.github.io/cheeseup/`** — no more 404.

The URL in the browser will show `https://cheeseupwax.github.io/cheeseup/#/` which is normal and expected behaviour for GitHub Pages SPAs.
