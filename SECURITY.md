# Security Policy

## Reporting a vulnerability

Quartz Finder is a static catalog site with no user accounts, no payment
processing, and no PII collection. The wishlist + age-gate states are stored
**only in the visitor's browser** (localStorage). There is no server-side data
to compromise.

If you find a vulnerability anyway — for example, an XSS vector in user input,
a missing security header, or a dependency CVE — please **do not open a public
issue.** Instead:

1. Email the maintainer privately (see git log) **or**
2. Use GitHub's "Report a vulnerability" privately on this repository.

We aim to acknowledge within 72 hours.

## Hardening already in place

- Strict TypeScript, ESLint `next/core-web-vitals`
- Security headers via `next.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`
- All affiliate-out links use `rel="noopener noreferrer nofollow"` + `target="_blank"`
- No `dangerouslySetInnerHTML` in this repo
- No `eval`, no `new Function`, no inline event handlers
- `poweredByHeader: false` to mask framework version

## Out of scope

- Vulnerabilities in third-party domains we link to
- Self-XSS (visitor pasting code into devtools)
- Issues in development tooling that don't affect the production bundle
