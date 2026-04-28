# Cloudflare proxy + Traefik origin TLS

Yes — you can keep Cloudflare's full proxy / WAF / cache **and** terminate
real TLS at Traefik. The trick is matching Cloudflare's SSL mode to a cert
Traefik can prove origin ownership with.

## Recommended stack

1. **Cloudflare SSL/TLS mode → Full (strict)**
   Browser ↔ CF: CF's edge cert (free, automatic).
   CF ↔ Traefik: a real cert validated by CF.

2. **Origin cert: Let's Encrypt via DNS-01 challenge**
   HTTP-01 challenge can't traverse CF's proxy reliably. DNS-01 doesn't care —
   it writes a `_acme-challenge` TXT record via the Cloudflare API.

3. **Origin lockdown (defense in depth)**
   - **Authenticated Origin Pulls** — CF presents a client cert, Traefik
     enforces it. Anything not coming from CF is dropped at TLS handshake.
   - **Firewall the host** — only allow `80/443` from
     [Cloudflare IP ranges](https://www.cloudflare.com/ips/).

## Step-by-step (Coolify)

### 1. Create a Cloudflare API token

Cloudflare → Profile → API Tokens → Create Token → Custom Template:
- Permissions:
  - `Zone — Zone — Read`
  - `Zone — DNS — Edit`
- Zone Resources: Include → `pillarpearl.com`

Save the token.

### 2. Configure Traefik (Coolify) for Cloudflare DNS-01

In Coolify → Server → Settings → Proxy → Traefik, add the env vars:

```
CLOUDFLARE_DNS_API_TOKEN=<token-from-step-1>
```

Add a `cloudflare` certresolver in the Traefik static config (Coolify exposes
the Traefik config file under the proxy settings):

```yaml
certificatesResolvers:
  cloudflare:
    acme:
      email: you@pillarpearl.com
      storage: /traefik/acme.json
      dnsChallenge:
        provider: cloudflare
        resolvers:
          - 1.1.1.1:53
          - 1.0.0.1:53
```

Override the Coolify-injected resolver on this app:

```
# Coolify env on the resource
COOLIFY_TRAEFIK_CERT_RESOLVER=cloudflare
```

(Equivalent label: `traefik.http.routers.<router>.tls.certresolver=cloudflare`.)

### 3. Cloudflare DNS records

```
A    pillarpearl.com       → <vps-ip>    Proxied (orange cloud)
A    www.pillarpearl.com   → <vps-ip>    Proxied (orange cloud)
```

### 4. Cloudflare → SSL/TLS → Overview

Set encryption mode to **Full (strict)**. Anything weaker (Flexible, Full
without "strict") accepts self-signed origin certs and is unsafe.

### 5. Optional — Authenticated Origin Pulls

Cloudflare → SSL/TLS → Origin Server → Authenticated Origin Pulls → toggle
**On**. CF will then present its client cert to Traefik on every request.

Add to the app's Traefik labels (or via Coolify custom labels):

```yaml
traefik.http.routers.pillarpearl.tls.options: cloudflare-aop@file
```

In Traefik dynamic config:

```yaml
tls:
  options:
    cloudflare-aop:
      clientAuth:
        caFiles:
          - /etc/traefik/cf-origin-pull-ca.pem
        clientAuthType: RequireAndVerifyClientCert
```

`cf-origin-pull-ca.pem` is published at
<https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem>.

### 6. Optional — UFW/iptables allowlist

Restrict ports 80/443 to CF IP ranges:

```bash
# refresh into /etc/cf-ips.txt periodically (cron)
curl -s https://www.cloudflare.com/ips-v4 > /etc/cf-ips-v4.txt
curl -s https://www.cloudflare.com/ips-v6 > /etc/cf-ips-v6.txt

# UFW
sudo ufw default deny incoming
sudo ufw allow 22/tcp
while read ip; do sudo ufw allow proto tcp from "$ip" to any port 80,443; done < /etc/cf-ips-v4.txt
while read ip; do sudo ufw allow proto tcp from "$ip" to any port 80,443; done < /etc/cf-ips-v6.txt
sudo ufw enable
```

## Verify

```bash
# 1. Cert chain (should be Let's Encrypt, not CF Origin CA)
echo | openssl s_client -connect pillarpearl.com:443 -servername pillarpearl.com 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates

# 2. Direct-to-origin should fail if AOP enabled
curl -sk https://<vps-ip>/ | head -2     # expect TLS handshake failure

# 3. Through Cloudflare should succeed
curl -sI https://pillarpearl.com/ | head -10
```

## Why this beats CF Origin Certificates

CF Origin Certs are 15-year self-signed-by-CF certs. They work fine but:
- Only valid CF ↔ origin (trust-anchored to CF, not WebPKI)
- Useless if you ever need to bypass CF for testing
- Can't be reused for non-CF traffic

LE via DNS-01 is publicly trusted everywhere, auto-renews, and the CF API
token can be scoped tightly enough that compromise is bounded.

## Headers note

`next.config.ts` already sends HSTS, CSP, X-Frame-Options, etc. CF will pass
those through unchanged with proxy on. Don't double-set them in CF
Transform Rules.

CSP `connect-src 'self'` may need extension if you later add Cloudflare
Turnstile, Web Analytics, or Workers — those domains must be whitelisted.
