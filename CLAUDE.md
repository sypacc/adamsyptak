# Pravidla pro tohle repo (čti před jakoukoli změnou)

Web na https://sypacc.github.io/adamsyptak/ má **přesně dvě části a nic dalšího**:

| Adresa | Co to je | Kód |
|---|---|---|
| `/` | Portfolio Adama Syptáka | `index.html`, `src/main.jsx`, `src/App.jsx`, `src/components/`, `src/hooks/`, `src/styles/global.css` |
| `/project/` | **TrackWise – školní projekt** (video v hero, rezervace, merch, košík) | `project/index.html`, `src/project-main.jsx`, `src/trackwise/`, `src/styles/trackwise.css`, `public/assets/project/` |

`/sluzba/` je jen přesměrování na `/project/` (pro staré odkazy). Žádný jiný obsah tam není.

## Co se nesmí dělat bez výslovného pokynu majitele

- **Neměnit nic, o co majitel výslovně nepožádal.** Žádné „vylepšení navíc“, žádné přepisování textů, designu ani funkcí z vlastní iniciativy.
- **TrackWise je jediný školní projekt.** Nevytvářet nové projekty, stránky ani vstupní body (`vite.config.js` → `rollupOptions.input`) a nepřidávat alternativy.
- **Odkaz „Školní projekt“** v patičce portfolia (`src/components/Contact.jsx`) vede vždy na `project/`. Nepřesměrovávat ho jinam.
- **Nesahat na TrackWise** (`src/trackwise/`, `src/styles/trackwise.css`, `project/`, `public/assets/project/`, hlavně video `hero-loop*.mp4` a poster), pokud se úkol netýká přímo TrackWise.
- **Nesahat na portfolio**, pokud se úkol netýká přímo portfolia.
- Nemazat ani nepřepisovat fotky a videa v `public/` a `media-src/`.

Když není jasné, jestli změna patří do zadání, **zeptej se**, nedělej ji.

## Nasazení

- GitHub Pages smí nasazovat jen z větve **`claude/friendly-rubin-5tbair`** (pravidlo prostředí `github-pages`).
  Workflow `.github/workflows/deploy.yml` proto běží jen na push do této větve (nebo ručně).
- Postup: změna → PR do `main` → merge → PR z `main` do `claude/friendly-rubin-5tbair` → merge → deploy.
- Před pushem vždy `npm run build` a ověřit, že se `/` i `/project/` načtou bez chyb.
- Obě `index.html` mají malý skript, který po nasazení nové verze jednou obnoví stránku,
  pokud prohlížeč z cache načetl staré HTML s odkazy na už smazané soubory. Neodstraňovat.
