
## CheeseUp — WAX PowerUp dApp with cheese.null Theme

A full rebuild of the **cheese-power** dApp using the dark gold glassmorphism aesthetic from **cheese.null**. This is a client-side only WAX blockchain dApp — no backend needed.

---

### 1. Theme & Design System
- Update `index.css` with cheese.null CSS variables: `--cheese` (amber gold), `--cheese-light`, `--cheese-dark`, `--cheese-cream`, `--cheese-glow`
- Dark near-black background with warm amber tint
- Custom utility classes: `cheese-glow`, `cheese-glow-intense`, `text-cheese-gradient`
- Glassmorphism card style: dark semi-transparent with cheese-tinted borders

---

### 2. App Layout & Header
- Fixed top header with **CheeseUp** logo (animated cheese coin icon)
- WAX wallet **Connect / Disconnect** button in the header
- Connected account name + CHEESE balance display
- Animated subtle golden glow background effects across the whole page

---

### 3. PowerUp Card (Core Feature)
- Glassmorphism card with cheese-glow border
- **Recipient field** — WAX account name input (auto-fills connected wallet)
- **CPU slider + input** — select milliseconds of CPU to purchase
- **NET slider + input** — select kilobytes of NET to purchase
- **Live cost estimator** — shows estimated CHEESE cost as sliders change
- **"POWER UP" button** — cheese-glow-intense styled, disabled when wallet not connected
- **Success Dialog** — appears after transaction confirming CPU ms, NET bytes, CHEESE spent, and recipient

---

### 4. Global Stats Bar
- Displayed below the PowerUp card in a 3-column glass card grid
- **Total Powerups** — count of all powerup transactions
- **WAX Burnt** — total WAX used across all powerups
- **CHEESE Nulled** — total CHEESE spent/burned through the contract
- Data fetched live from the WAX blockchain contract tables

---

### 5. Wallet Integration
- Install and configure **WharfKit** (`@wharfkit/session`, `@wharfkit/web-renderer`, `@wharfkit/wallet-plugin-cloudwallet`, `@wharfkit/wallet-plugin-anchor`)
- SessionKit setup supporting **WAX Cloud Wallet** and **Anchor Wallet**
- Persistent session restore on page reload
- React context to share wallet session state across components

---

### 6. On-Chain Contract Interaction
- **PowerUp action** — calls the `cheeseburger` contract's `powerup` action with CPU ms, NET bytes, recipient, and CHEESE amount
- **Table reads** — fetch global stats (total powerups, WAX burnt, CHEESE nulled) from contract tables via WAX API (using `@tanstack/react-query` for caching & refetching)
- **CHEESE balance** — reads connected account's CHEESE token balance from the `eosio.token` contract
- **Cost estimation** — fetches current resource prices from contract to compute real-time CHEESE cost

---

### 7. Page Structure (Single Page)
```
Header (logo + wallet connect)
  ↓
Hero Section (CheeseUp title + tagline + decorative cheese coin)
  ↓
PowerUp Card (recipient + CPU/NET sliders + cost + action button)
  ↓
Stats Bar (total powerups | WAX burnt | CHEESE nulled)
  ↓
Footer (contract links, cheese.null branding)
```

---

### Tech Summary
| Item | Detail |
|---|---|
| Wallet | WharfKit SessionKit |
| Chain calls | WAX Mainnet (`wax.greymass.com`) |
| Data fetching | TanStack React Query |
| Styling | Tailwind + custom cheese tokens |
| Backend | None — fully client-side |
