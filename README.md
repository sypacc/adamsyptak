# Adam Sypták — portfolio

Osobní portfolio + školní projekt TrackWise, React (Vite), dvě samostatné stránky
v jednom buildu: `/` (portfolio), `/project/` (TrackWise) a `/sluzba/` (nový školní projekt — služba).

## Struktura

```
index.html                 — vstupní bod portfolia (meta, OG náhled, preload fontu)
project/index.html         — vstupní bod TrackWise
src/
  main.jsx                 — spuštění portfolia
  App.jsx                  — portfolio složené z komponent
  components/              — sekce portfolia (Header, Hero, About, Built, ...)
  hooks/useSiteEffects.js  — scroll efekty, odhalování při scrollu, tilt/spotlight, pozadí
  hooks/useSmoothScroll.js — plynulý scroll (Lenis), jen pro myš/trackpad
  utils/background.js      — generování vrstevnicového pozadí
  styles/global.css        — styly portfolia
  project-main.jsx         — spuštění TrackWise
  trackwise/               — TrackWise: komponenty, contexty (téma, účet, košík), wizard
  styles/trackwise.css     — styly TrackWise
  sluzba-main.jsx          — spuštění projektu Služba (vstup sluzba/index.html)
  sluzba/                  — projekt Služba; texty v sluzba/content.js
  styles/sluzba.css        — styly projektu Služba
public/                    — statické soubory kopírované beze změny (fotky, video, OG, 404)
media-src/                 — originální fotky/logo v plné kvalitě (nenasazují se)
```

## Lokální vývoj

```
npm install
npm run dev
```

Otevře se na `http://localhost:5173/adamsyptak/`.

## Produkční build

```
npm run build
npm run preview
```

Výstup se generuje do `dist/`.

## Fotky a obrázky

Na webu se používají optimalizované varianty v `public/assets/img/photos/`
(AVIF + WebP ve dvou šířkách, např. `adam-portrait-800.avif`, `adam-portrait-1400.webp`).
Originály jsou v `media-src/`. Při přidání nové fotky je potřeba vygenerovat
stejné varianty (stačí poslat fotku Claudovi).

## Nasazení na GitHub Pages

Stránka se builduje (React/Vite), takže už nejde nasadit přímo z branche —
nasazení zajišťuje workflow `.github/workflows/deploy.yml`, který při každém
push na `main` stránku zbuilduje a nahraje na GitHub Pages.

**Jednorázové nastavení v repozitáři:**

1. **Settings → Pages**
2. V sekci **Build and deployment** přepnout **Source** na **GitHub Actions**
   (místo původního "Deploy from a branch").

Po tomto přepnutí se stránka při každém pushi na `main` automaticky zbuilduje
a nasadí na `https://sypacc.github.io/adamsyptak/`.
