import ResponsivePicture from "./ResponsivePicture.jsx";

const AWARDS = [
  {
    title: "1. místo, Změň svět pohybem",
    source: "UK, FTVS",
    year: "2025",
    href: "https://www.vecerni-praha.cz/ftvs-uk-vyhlasila-nejlepsi-studentske-inovace-mladi-lide-mohou-zmenit-svet-pohybem/",
  },
  {
    title: "Řečník",
    source: "TAFISA World Congress",
    year: "2026",
    href: "https://www.tafisacongress-prague2026.com/speakers/",
  },
  {
    title: "Zařazeno na data.Brno",
    source: "oficiální datový portál města",
    href: "https://data.brno.cz/apps/mestobrno::sportera-sportovi%C5%A1t%C4%9B-v-brn%C4%9B/explore",
  },
  {
    title: "Dobrá praxe",
    source: "NSZM ČR",
    href: "https://dobrapraxe.cz/cz/priklady-dobre-praxe/brno-sportera-platforma-sportu-dostupneho-pro-vsechny",
  },
  {
    title: "Nominace",
    source: "Cena Gratias Tibi",
    year: "2026",
    href: "https://www.gratiastibi.cz/cs/nominovane-projekty/sportera-2026",
  },
];

const MEDIA = [
  {
    title: "Rozhovor autorů projektu",
    source: "Klub Radia Junior",
    href: "https://junior.rozhlas.cz/autori-projektu-sportera-adam-syptak-a-stanislav-macak-v-klubu-radia-junior-9591191",
  },
  {
    title: "Studenti VUT vytvořili projekt, který propojuje sportovce s hřišti",
    source: "Brněnská Drbna",
    href: "https://brnenska.drbna.cz/sport/36015-nepojmenovano-13-17-24-532026.html",
  },
  {
    title: "Zpravodajství",
    source: "Česká televize",
    href: "https://www.ceskatelevize.cz/porady/1178166846-zpravy/225411016001204/",
  },
];

function LinkList({ items, label }) {
  return (
    <ul className="link-list" aria-label={label}>
      {items.map((item) => (
        <li key={item.href}>
          <a className="link-row" href={item.href} target="_blank" rel="noopener noreferrer">
            <span className="link-row-title">{item.title}</span>
            <span className="link-row-meta">
              {item.source}
              {item.year ? <span className="link-row-year">{item.year}</span> : null}
            </span>
            <span className="link-row-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Built() {
  return (
    <section className="section" id="postaveno" aria-labelledby="postaveno-heading">
      <div className="wrap section-grid">
        <h2 className="section-title" id="postaveno-heading">Co jsem postavil</h2>
        <div className="section-content">
          <ol className="entries" data-reveal="true">
            <li className="entry">
              <p className="entry-when">2024 – dosud</p>
              <div className="entry-body">
                <h3 className="entry-title">
                  Sportera Team s.r.o.
                  <span className="entry-role">Spoluzakladatel a CEO</span>
                </h3>
                <p>
                  Mám na starosti strategii, vedení týmu a chod firmy – od prvního kontaktu s partnerem
                  přes podpis smlouvy a obhajobu jejího znění až po komunikaci s účetní. Platforma dnes
                  mapuje 2&nbsp;526 hřišť pro 11 sportů v 856 obcích.
                </p>
                <p className="entry-areas">
                  Strategie · Vedení týmu · Partnerství · Smlouvy · Komunikace s účetní · Produkt
                </p>
                <a className="link" href="https://sportera.cz" target="_blank" rel="noopener noreferrer">
                  sportera.cz<span aria-hidden="true"> ↗</span>
                </a>
              </div>
            </li>
            <li className="entry">
              <p className="entry-when">2023 – dosud</p>
              <div className="entry-body">
                <h3 className="entry-title">
                  Družstvo Virtigo
                  <span className="entry-role">Předseda (12 členů), nyní likvidátor</span>
                </h3>
                <p>
                  Vedl jsem organizační strukturu a delegaci funkcí pro družstvo 12 lidí. Teď jako
                  likvidátor řídím proces jeho řádného ukončení.
                </p>
              </div>
            </li>
          </ol>

          <div className="subsection" data-reveal="true">
            <h3 className="subsection-title">Ocenění a uznání</h3>
            <LinkList items={AWARDS} label="Ocenění a uznání" />
          </div>

          <div className="subsection" data-reveal="true">
            <h3 className="subsection-title">V médiích</h3>
            <LinkList items={MEDIA} label="V médiích" />
          </div>

          <div className="photos" data-reveal="true">
            <figure className="photo photo--wide">
              <a href="https://www.vut.cz/vut/aktuality-f19528/sest-novych-start-upu-a-spin-offu-vut-univerzitni-inovace-miri-do-praxe-d313995" target="_blank" rel="noopener noreferrer">
                <ResponsivePicture
                  name="sportera-podpis"
                  widths={[800, 1400]}
                  sizes="(min-width: 900px) 560px, calc(100vw - 2.5rem)"
                  alt="Podpis oficiálního startupu na VUT"
                  width="1600"
                  height="1067"
                />
              </a>
              <figcaption>Podpis oficiálního startupu na VUT</figcaption>
            </figure>
            <figure className="photo">
              <a href="https://www.vecerni-praha.cz/ftvs-uk-vyhlasila-nejlepsi-studentske-inovace-mladi-lide-mohou-zmenit-svet-pohybem/" target="_blank" rel="noopener noreferrer">
                <ResponsivePicture
                  name="sportera-zmen-svet-pohybem"
                  widths={[500, 900]}
                  sizes="(min-width: 900px) 270px, calc(50vw - 1.5rem)"
                  alt="Tým Sportera přebírá 1. místo v soutěži Změň svět pohybem 2025"
                  width="1228"
                  height="1536"
                />
              </a>
              <figcaption>1. místo, Změň svět pohybem 2025</figcaption>
            </figure>
            <figure className="photo">
              <a href="https://sportera.cz" target="_blank" rel="noopener noreferrer">
                <ResponsivePicture
                  name="sportera-mapa-fakta"
                  widths={[500, 900]}
                  sizes="(min-width: 900px) 270px, calc(50vw - 1.5rem)"
                  alt="Grafika Sportera: 2 526 sportovišť po celém Česku, kam se nemusí platit vstup"
                  width="1080"
                  height="1350"
                />
              </a>
              <figcaption>Sportera v číslech</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
