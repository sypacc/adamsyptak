# Adam Sypták — portfolio

Osobní portfolio, React (Vite).

## Struktura

```
index.html              — Vite vstupní bod hlavní stránky
project/index.html      — Vite vstupní bod stránky školního projektu
src/
  main.jsx               — spuštění hlavní stránky
  project-main.jsx        — spuštění stránky školního projektu
  App.jsx                 — sestavení hlavní stránky z komponent
  ProjectPage.jsx          — obsah stránky školního projektu
  components/              — jednotlivé sekce stránky (Header, Hero, About, ...)
  hooks/useSiteEffects.js  — scroll efekty, animace při scrollu, tilt/spotlight
  utils/background.js      — generování vrstevnicového pozadí
  styles/global.css        — veškeré styly (dark, minimalistický design)
public/assets/img/         — favicon a fotky (kopírují se beze změny do výstupu)
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

## Nasazení na GitHub Pages

Stránka se teď builduje (React/Vite), takže už nejde nasadit přímo z branche —
nasazení zajišťuje workflow `.github/workflows/deploy.yml`, který při každém
push na `main` stránku zbuilduje a nahraje na GitHub Pages.

**Jednorázové nastavení v repozitáři:**

1. **Settings → Pages**
2. V sekci **Build and deployment** přepnout **Source** na **GitHub Actions**
   (místo původního "Deploy from a branch").

Po tomto přepnutí se stránka při každém pushi na `main` automaticky zbuilduje
a nasadí na `https://sypacc.github.io/adamsyptak/`.
