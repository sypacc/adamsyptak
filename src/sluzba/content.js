// Veškerý text stránky na jednom místě — až bude jasné, o jakou službu jde,
// stačí přepsat tenhle soubor.
export const BRAND = "Název služby";

export const NAV_LINKS = [
  { id: "uvod", label: "Úvod" },
  { id: "nabidka", label: "Nabídka" },
  { id: "postup", label: "Jak to funguje" },
  { id: "objednavka", label: "Objednávka" },
];

export const HERO = {
  eyebrow: "Školní projekt",
  title: "Služba, která ti ušetří čas.",
  lede: "Krátký popis toho, co služba dělá a pro koho je. Jedna až dvě věty, které zákazníkovi řeknou, proč tu má zůstat.",
  cta: "Objednat",
};

export const OFFERS = [
  { id: "zaklad", name: "Základ", price: "490 Kč", desc: "Nejjednodušší varianta služby pro jednorázovou potřebu.", features: ["Bod nabídky", "Bod nabídky", "Bod nabídky"] },
  { id: "standard", name: "Standard", price: "990 Kč", desc: "Nejčastější volba — vyvážený poměr ceny a rozsahu.", features: ["Vše ze Základu", "Bod nabídky", "Bod nabídky"], featured: true },
  { id: "premium", name: "Premium", price: "1 890 Kč", desc: "Kompletní servis pro náročnější zákazníky.", features: ["Vše ze Standardu", "Bod nabídky", "Bod nabídky"] },
];

export const STEPS = [
  { title: "Vybereš si", text: "Zvolíš variantu služby, která ti sedí." },
  { title: "Objednáš", text: "Vyplníš krátký formulář s termínem a kontaktem." },
  { title: "Potvrdíme", text: "Ozveme se a domluvíme detaily." },
  { title: "Hotovo", text: "Služba je vyřízená a ty máš klid." },
];
