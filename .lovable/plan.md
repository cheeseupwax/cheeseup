
## Deploy CheeseUp to GitHub Pages

### Repository Details
- GitHub Org/User: `cheeseupwax`
- Repository name: `cheeseup`
- Final URL will be: **https://cheeseupwax.github.io/cheeseup/**

---

### What needs to change

**Two files to create/modify:**

**1. `vite.config.ts` — add `base` path**

Without this, GitHub Pages will serve the site from `/cheeseup/` but Vite will generate asset links starting from `/`, causing a blank white page. Adding `base: '/cheeseup/'` fixes this.

**2. `.github/workflows/deploy.yml` — new GitHub Actions workflow**

This file automates the entire build and deploy process. Every push to `main` triggers it automatically.

---

### Deployment Flow

```text
Push to main (from Lovable or GitHub)
         ↓
GitHub Actions: install deps → build → deploy
         ↓
Site live at https://cheeseupwax.github.io/cheeseup/
```

---

### Technical Details

**`vite.config.ts` change:**
```ts
base: '/cheeseup/',
```
Added inside the `defineConfig` object, alongside the existing `server` and `plugins` config.

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

---

### One manual step you do in GitHub (after first workflow run)

1. Go to **https://github.com/cheeseupwax/cheeseup/settings/pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

That's it — after approving this plan, every future push from Lovable will automatically rebuild and redeploy the live site.
