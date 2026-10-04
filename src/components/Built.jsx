import SplitHeading from "./SplitHeading.jsx";
import ResponsivePicture from "./ResponsivePicture.jsx";

function PhotoTile({ href, wide, picture, caption }) {
  return (
    <a
      className={"photo-tile" + (wide ? " photo-tile--wide" : "")}
      data-reveal="true"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="photo-media">
        <ResponsivePicture {...picture} />
      </div>
      <span className="photo-caption">{caption}</span>
    </a>
  );
}

export default function Built() {
  return (
    <section className="section" id="postaveno" aria-labelledby="postaveno-heading">
      <div className="wrap">
        <span className="section-watermark" aria-hidden="true">02</span>
        <p className="section-number" data-reveal="true">02</p>
        <SplitHeading id="postaveno-heading" text="Co jsem zatím postavil" />

        <div className="cards cards--split">
          <article className="card tilt" data-reveal="true">
            <p className="card-role">Spoluzakladatel &amp; Business Lead</p>
            <h3>Sportera Team s.r.o.</h3>
            <p className="card-meta">2024 – dosud</p>
            <p>
              Řídím strategii, partnerství a provoz firmy — od prvního kontaktu s partnerem po podpis
              smlouvy a obhajobu jejího znění. Platforma dnes pokrývá 1&nbsp;100+ sportovišť ve 380+ obcích.
            </p>
            <a className="card-link" href="https://sportera.cz" target="_blank" rel="noopener noreferrer">sportera.cz →</a>
          </article>

          <article className="card tilt" data-reveal="true">
            <p className="card-role">Předseda (12 členů) → likvidátor</p>
            <h3>Družstvo Virtigo</h3>
            <p className="card-meta">2023 – dosud</p>
            <p>
              Vedl jsem organizační strukturu a delegaci funkcí pro družstvo 12 lidí. Teď jako
              likvidátor řídím proces jeho řádného ukončení.
            </p>
          </article>
        </div>

        <div className="recognition-panel spotlight" data-reveal="true">
          <h3>Externí ocenění</h3>

          <div className="tile-group">
            <p className="tile-group-label">Ocenění a uznání</p>
            <div className="tile-row">
              <a className="tile-link spotlight" data-reveal="true" href="https://www.vecerni-praha.cz/ftvs-uk-vyhlasila-nejlepsi-studentske-inovace-mladi-lide-mohou-zmenit-svet-pohybem/" target="_blank" rel="noopener noreferrer">
                1. místo, Změň svět pohybem
                <span className="tile-meta">UK, FTVS · 2025</span>
              </a>
              <a className="tile-link spotlight" data-reveal="true" href="https://www.tafisacongress-prague2026.com/speakers/" target="_blank" rel="noopener noreferrer">
                Řečník
                <span className="tile-meta">TAFISA World Congress · 2026</span>
              </a>
              <a className="tile-link spotlight" data-reveal="true" href="https://data.brno.cz/apps/mestobrno::sportera-sportovi%C5%A1t%C4%9B-v-brn%C4%9B/explore" target="_blank" rel="noopener noreferrer">
                Zařazeno na data.Brno
                <span className="tile-meta">oficiální datový portál města</span>
              </a>
              <a className="tile-link spotlight" data-reveal="true" href="https://dobrapraxe.cz/cz/priklady-dobre-praxe/brno-sportera-platforma-sportu-dostupneho-pro-vsechny" target="_blank" rel="noopener noreferrer">
                Dobrá praxe
                <span className="tile-meta">NSZM ČR</span>
              </a>
              <a className="tile-link spotlight" data-reveal="true" href="https://www.gratiastibi.cz/cs/nominovane-projekty/sportera-2026" target="_blank" rel="noopener noreferrer">
                Nominace
                <span className="tile-meta">Cena Gratias Tibi · 2026</span>
              </a>
            </div>
          </div>

          <div className="tile-group">
            <p className="tile-group-label">V médiích</p>
            <div className="tile-row">
              <a className="tile-link spotlight" data-reveal="true" href="https://junior.rozhlas.cz/autori-projektu-sportera-adam-syptak-a-stanislav-macak-v-klubu-radia-junior-9591191" target="_blank" rel="noopener noreferrer">
                Rozhovor autorů projektu
                <span className="tile-meta">Klub Radia Junior</span>
              </a>
              <a className="tile-link spotlight" data-reveal="true" href="https://brnenska.drbna.cz/sport/36015-nepojmenovano-13-17-24-532026.html" target="_blank" rel="noopener noreferrer">
                Studenti VUT vytvořili projekt, který propojuje sportovce s hřišti
                <span className="tile-meta">Brněnská Drbna</span>
              </a>
              <a className="tile-link spotlight" data-reveal="true" href="https://www.ceskatelevize.cz/porady/1178166846-zpravy/225411016001204/" target="_blank" rel="noopener noreferrer">
                Zpravodajství
                <span className="tile-meta">Česká televize</span>
              </a>
            </div>
          </div>
        </div>

        <div className="photo-grid">
          <PhotoTile
            wide
            href="https://www.vut.cz/vut/aktuality-f19528/sest-novych-start-upu-a-spin-offu-vut-univerzitni-inovace-miri-do-praxe-d313995"
            caption="Podpis oficiálního startupu na VUT"
            picture={{
              name: "sportera-podpis",
              widths: [800, 1400],
              sizes: "(min-width: 720px) 900px, 100vw",
              alt: "Podpis oficiálního startupu na VUT",
              width: "1600",
              height: "1067",
            }}
          />
          <PhotoTile
            href="https://www.vecerni-praha.cz/ftvs-uk-vyhlasila-nejlepsi-studentske-inovace-mladi-lide-mohou-zmenit-svet-pohybem/"
            caption="1. místo, Změň svět pohybem 2025"
            picture={{
              name: "sportera-zmen-svet-pohybem",
              widths: [500, 900],
              sizes: "(min-width: 720px) 340px, 100vw",
              alt: "Tým Sportera přebírá 1. místo v soutěži Změň svět pohybem 2025",
              width: "1228",
              height: "1536",
            }}
          />
          <PhotoTile
            href="https://sportera.cz"
            caption="Sportera v číslech"
            picture={{
              name: "sportera-mapa-fakta",
              widths: [500, 900],
              sizes: "(min-width: 720px) 340px, 100vw",
              alt: "Grafika Sportera: 1 135 sportovišť po celém Česku, kam se nemusí platit vstup",
              width: "1080",
              height: "1350",
            }}
          />
        </div>
      </div>
    </section>
  );
}
