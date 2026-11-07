# Pitchtory — Landing

Landing page statica e bilingue per **Pitchtory**, il football manager PWA di Little Elsewhere.
Zero build, zero dipendenze: solo HTML, CSS e JavaScript di piattaforma.

**Deploy:** GitHub → Cloudflare Pages (project name `pitchtory-home`) → <https://pitchtory-home.pages.dev/>

## Struttura

```
index.html          Landing IT (autorità SEO per la lingua italiana)
en/index.html       Landing EN (file separato, indicizzabile)
privacy.html        Privacy IT
en/privacy.html     Privacy EN
main.js             Script IT/EN-shared: tema, reveal, demo QTE (versione EN: en/main.js con stringhe localizzate)
favicon.svg         Favicon ufficiale (dal Logo Kit)
robots.txt          Allow all + sitemap
sitemap.xml         4 URL con xhtml:link hreflang incrociati
_headers            CSP (script-src con hash SHA-256 dell'anti-FOUC), HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy
LICENSE             MIT
```

## Standard rispettati (vedi knowledge "PWA & Landing")

- **Bilingue a file separati** con hreflang incrociati (`it` → `/`, `en` → `/en/`, `x-default`), canonical assoluta per pagina, pill IT/EN con link reciproci
- **Tema chiaro/scuro**: automatico da `prefers-color-scheme` + switch manuale in nav, persistente via localStorage **chiave condivisa `pitchtory-theme`** (vale per IT, EN e privacy), anti-FOUC inline nell'`<head>` (hash SHA-256 in CSP)
- **Reveal on scroll** con IntersectionObserver + fallback; `prefers-reduced-motion` rispettato (ticker, fade, flash)
- **SEO**: robots.txt + sitemap.xml, title/description unici per lingua, JSON-LD `SoftwareApplication` con `offers price "0"` e **nessun rating auto-attribuito**
- **Social**: `og:image` 1200×630 localizzata con `og:image:alt`, `twitter:card summary_large_image`
- **Accessibilità**: aria-label su toggle tema e pill lingua, focus visibile, contrasti AA su entrambi i temi, `aria-live` sul verdetto della demo QTE
- **Footer con soli link reali** (app, GitHub, privacy, profilo studio): nessun `#`

## TODO dopo il deploy (a mano)

1. **Immagini og (binarie, da caricare via web)**: esporta `og.jpg` (IT) e `en/og.jpg` (EN) dal canvas "Pitchtory — Logo Kit" e caricale nella root e in `en/`. L'integrazione GitHub corrompe i file binari, quindi niente push.
2. **URL dell'app**: tutte le CTA puntano a `https://pitchtory.pages.dev/` — aggiorna i link (nav + hero + footer, in IT e EN) quando l'app di Pitchtory viene deployata con F6, se il project name sarà diverso.
3. **Google Search Console**: aggiungi il meta tag di verifica (Prefisso URL, i domini `*.pages.dev` non supportano la verifica DNS), invia la sitemap e richiedi l'indicizzazione per `/` e `/en/`.
4. **CSP**: verifica sul deploy di preview di Cloudflare Pages prima del go-live (lo standard prevede test in Report-Only; qui è già enforced perché il solo script inline è l'anti-FOUC hashato — se modifichi lo script anti-FOUC, ricalcola l'hash: `sha256` del contenuto esatto tra `<script>` e `</script>` e aggiornalo in `_headers`).
5. **L'app resta `noindex`** (canonical → landing o `noindex` nel manifest dell'app): una sola casa indicizzata per prodotto.

## Note

- Il ticker dei risultati e i club citati sono fittizi ma validati: appartengono all'universo di gioco (AC Velmare 1906, Fortitudo Claverna, …).
- La demo QTE della landing usa pesi codificati in base64: i calcoli reali del gioco non sono stampati nel sorgente.
- Font: Oswald + Archivo via Google Fonts con `preconnect` e `font-display: swap`. Il giorno in cui servano self-hosted, aggiungere i woff2 + preload (binari → upload manuale).

---

Little Elsewhere · composto in Oswald, pubblicato senza server.
