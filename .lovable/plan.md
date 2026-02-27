

## Fix: Wallet connect spinner stuck after closing popup

### Problem

When you click "Connect Wallet" and then close the wallet selection popup without choosing a wallet, the loading spinner stays spinning forever. This happens because the `connect()` function sets `isLoading: true` at the start, but if `kit.login()` resolves without returning a session (user cancelled), the code never sets `isLoading` back to `false`.

### Fix

**File: `src/hooks/useWaxWallet.ts`** — in the `connect` function, add a fallback after the `if (response.session)` block to reset `isLoading` when no session is returned:

```ts
const response = await kit.login();
if (response.session) {
  // ... existing session handling ...
} else {
  // User cancelled — reset loading state
  setState((prev) => ({ ...prev, isLoading: false }));
}
```

This single addition ensures that if the login popup is closed without selecting a wallet, the UI returns to its normal "Connect Wallet" state instead of showing a permanent spinner.

