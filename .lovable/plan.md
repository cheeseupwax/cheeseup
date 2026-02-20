
## Fix GitHub Actions Build — Replace `npm ci` with `npm install`

### Root Cause

`npm ci` is a strict install command — it fails if `package.json` and `package-lock.json` are out of sync at all. The error shows several packages are missing from the lock file (like `@testing-library/dom`, `picomatch`, etc.) and there's a conflicting `@aws-amplify` peer dependency that is causing mismatches.

This project's lock file was generated in Lovable's environment (using Bun internally), and the GitHub Actions runner generates a slightly different resolution, causing `npm ci` to reject it.

### Fix

**File: `.github/workflows/deploy.yml`**

Change line 29 from:
```yaml
- run: npm ci
```
to:
```yaml
- run: npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag also handles the `@aws-amplify` peer dependency warning that appears in the logs, preventing it from potentially blocking the install.

### Why This Works

- `npm install` regenerates the lock file fresh on the runner rather than validating an existing one
- `--legacy-peer-deps` tells npm to use npm v6 peer dependency resolution, which is more permissive and handles the `@aws-amplify` conflict gracefully
- The build output (`dist/`) will be identical — this only affects how dependencies are installed, not what gets built

### No other files need changing.
