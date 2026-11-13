# AgentGuard NEAR — Spending Policy Simulator

An experimental interface exploring how proposed NEAR transfers could be checked against spending policies.

## Current implementation
- Configure daily and per-transaction spending limits.
- Evaluate a recipient and requested amount.
- Generate ALLOW, WARN or BLOCK decisions using local rules.
- Track allowed amounts and recent decisions during the current page session.
- Reset the local simulation.

## Important limitation
This repository currently contains a **local policy simulator**, not an on-chain security enforcement product. It does not connect a wallet, sign or broadcast transactions, intercept agent actions, enforce policies against a live NEAR account, or persist policy data to Supabase. Do not rely on it to protect real funds.

## Run locally
Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Verify a production build with:

```bash
npm run build
```

## Roadmap
1. Add authenticated, owner-scoped policy storage.
2. Integrate NEAR transaction construction and simulation without exposing signing keys.
3. Implement a trusted enforcement boundary before wallet signing.
4. Add automated tests for policy edge cases.
5. Complete an independent security review before any real-fund use.

Never commit wallet seed phrases, private keys, service-role credentials or production secrets.

## Author
Tuquash — https://github.com/Tuquash
