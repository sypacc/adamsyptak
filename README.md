# Adam Sypták — portfolio

Osobní portfolio, statická stránka bez frameworků a bez buildovacího kroku.

## Struktura

```
index.html          — obsah stránky
assets/css/style.css — styly (dark, minimalistický design)
assets/js/main.js    — mobilní menu, aktivní odkaz v navigaci, animace při scrollu
assets/img/          — favicon a další obrázky
```

## Lokální vývoj

Stránka nepotřebuje žádný build. Pro lokální náhled stačí spustit statický server, např.:

```
python3 -m http.server 8080
```

a otevřít `http://localhost:8080`.

## Nasazení na GitHub Pages

1. V repozitáři přejít do **Settings → Pages**.
2. V sekci **Build and deployment** vybrat **Source: Deploy from a branch**.
3. Zvolit branch `main` a složku `/ (root)`.
4. Uložit — stránka se objeví na `https://<uzivatel>.github.io/<repo>/`.

## TODO

- V sekci Kontakt (`index.html`, `#kontakt`) doplnit skutečné odkazy na e-mail, LinkedIn a GitHub.
