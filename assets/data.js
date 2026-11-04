/* KIOS prototype data.
   Photos: Instagram @kios_sanna_ and @kios_kids_.
   Prices marked "post" come from the shop's own captions (date of the post in the comment);
   all the others are indicative. Every price is shown on the site as "prezzo indicativo". */

window.KIOS_DATA = (function () {
  const D = { 38: 1, 40: 2, 42: 3, 44: 2, 46: 2, 48: 1, 50: 0, 52: 1 };
  const D2 = { 38: 0, 40: 1, 42: 2, 44: 3, 46: 2, 48: 2, 50: 1, 52: 1 };
  const D3 = { 38: 2, 40: 2, 42: 2, 44: 1, 46: 0, 48: 1, 50: 1, 52: 0 };
  const D4 = { 38: 0, 40: 0, 42: 1, 44: 2, 46: 2, 48: 2, 50: 2, 52: 1 };
  const UNICA = { Unica: 3 };
  const NB = { "1 mese": 2, "3 mesi": 2, "6 mesi": 1, "9 mesi": 0, "12 mesi": 2 };
  const NB2 = { "6 mesi": 1, "9 mesi": 2, "12 mesi": 2, "18 mesi": 1, "24 mesi": 0 };
  const BB = { "2 anni": 1, "3 anni": 2, "4 anni": 2, "5 anni": 0, "6 anni": 1, "8 anni": 2 };
  const RG = { "6 anni": 1, "8 anni": 2, "10 anni": 2, "12 anni": 1, "14 anni": 0 };

  const products = [
    // ---------- DONNA ----------
    { id: "pelliccia-alamari", world: "donna", cat: "giacche", novita: true,
      name: "Pelliccia ecologica con alamari", price: 89, src: "post 04.10.2025",
      img: ["d-pelliccia-alamari"], pos: "50% 30%", sizes: D2, fit: "abbondante",
      desc: "Corta, morbida, color panna, con gli alamari davanti. In negozio la abbiniamo al jeans chiaro e al tronchetto scamosciato.",
      pair: ["jeans-panna", "maglione-trecce", "borsa-ecopelliccia"] },
    { id: "maxi-maglione", world: "donna", cat: "maglieria", novita: true,
      name: "Maxi maglione", color: "Bordeaux", price: 59, src: "post 14.11.2025",
      img: ["d-maxi-maglione"], pos: "50% 25%", sizes: D, fit: "abbondante",
      desc: "Lungo fino a metà coscia: si porta da solo, come un abito, con lo stivale alto.",
      pair: ["cappotto-bordeaux", "guanti", "sciarpa-maculata"] },
    { id: "abito-paillettes", world: "donna", cat: "abiti", novita: true,
      name: "Abito in paillettes con spacco", color: "Nero", price: 79, src: "ind",
      img: ["d-abito-paillettes"], pos: "50% 30%", sizes: D3, fit: "aderente",
      desc: "Lungo, tutto in paillettes, con lo scollo a V e lo spacco. Per le feste e per le occasioni speciali.",
      pair: ["spilla", "blazer-velluto", "pochette"] },
    { id: "cappotto-bordeaux", world: "donna", cat: "giacche", novita: true,
      name: "Cappotto lungo doppiopetto", color: "Bordeaux", price: 129, src: "ind",
      img: ["d-cappotto-bordeaux", "d-cappotto-bordeaux-2"], pos: "50% 20%", sizes: D4, fit: "regolare",
      desc: "Lungo fino alla caviglia, doppiopetto, nel colore della stagione. Sta bene sul nero, sul jeans e sul maglione a righe.",
      pair: ["maglioncino-righe", "maxi-maglione", "guanti"] },
    { id: "completo-raso", world: "donna", cat: "abiti", novita: true, brand: "Kontatto",
      name: "Completo in raso", color: "Rosso", price: 139, src: "ind",
      img: ["d-completo-raso"], pos: "50% 25%", sizes: D2, fit: "regolare",
      desc: "Giacca e pantalone in raso, rosso acceso. Insieme per una cena di festa, separati per tutti i giorni.",
      pair: ["spilla", "pochette", "abito-paillettes"] },
    { id: "maglione-orsetto", world: "donna", cat: "maglieria", novita: true, brand: "Brend Atelier",
      name: "Maglione con orsetto", color: "Rosso, in tre colori", price: 49, src: "ind",
      img: ["d-maglione-orsetto"], pos: "50% 40%", sizes: D, fit: "regolare",
      desc: "Il maglione con l'orsetto, disponibile in tre colori. Con il jeans e la sciarpa maculata è subito il look delle feste.",
      pair: ["sciarpa-maculata", "jeans-panna", "cappello"] },
    { id: "borsa-ecopelliccia", world: "donna", cat: "accessori", novita: true, brand: "Brend Atelier",
      name: "Borsa in ecopelliccia", color: "Tortora, in due colori", price: 35, src: "ind",
      img: ["d-borsa-ecopelliccia"], pos: "50% 50%", sizes: UNICA, fit: "unica",
      desc: "Morbida, capiente, da portare a mano. Disponibile in due colori.",
      pair: ["pelliccia", "guanti", "maglione-trecce"] },
    { id: "pelliccia", world: "donna", cat: "giacche", novita: true,
      name: "Pelliccia ecologica", price: 89, src: "post 16.10.2025",
      img: ["d-pelliccia"], pos: "50% 25%", sizes: D3, fit: "abbondante",
      desc: "Il capospalla caldo della stagione: sta su tutto, dal pantalone sartoriale al jeans.",
      pair: ["borsa-ecopelliccia", "jeans-panna", "maglione-trecce"] },
    { id: "maglioncino-righe", world: "donna", cat: "maglieria", ultimo: true,
      name: "Maglioncino a righe", color: "Nero e panna", price: 39.9, src: "post 03.12.2024",
      img: ["d-maglioncino-righe"], pos: "40% 40%", fit: "regolare",
      sizes: { 38: 0, 40: 0, 42: 0, 44: 1, 46: 0, 48: 0, 50: 0, 52: 0 },
      desc: "Righe nere e panna, girocollo. È rimasto l'ultimo pezzo, nella 44.",
      pair: ["cappotto-bordeaux", "jeans-panna", "guanti"] },
    { id: "giacca-velluto", world: "donna", cat: "giacche", brand: "Susymix",
      name: "Giacca monopetto con spalline in velluto", color: "Nero", price: 89, src: "ind",
      img: ["d-giacca-velluto"], pos: "50% 30%", sizes: D4, fit: "regolare",
      desc: "Nera, monopetto, con le spalline in velluto. In negozio la abbiniamo al maglioncino con dettagli e al pantapalazzo in raso.",
      pair: ["maglione-trecce", "spilla", "pantalone-palazzo"] },
    { id: "gonna-paillettes", world: "donna", cat: "pantaloni",
      name: "Gonna lunga in paillettes", color: "Argento", price: 59, src: "ind",
      img: ["d-gonna-paillettes"], pos: "50% 40%", sizes: D, fit: "regolare",
      desc: "Lunga, argento, con lo spacco. Nel look «Total cream» con il maglione panna: perfetto per le feste.",
      pair: ["maglione-trecce", "spilla", "pelliccia-alamari"] },
    { id: "jeans-panna", world: "donna", cat: "pantaloni",
      name: "Jeans lungo", color: "Panna, anche nero", price: 49, src: "ind",
      img: ["d-jeans-panna"], pos: "50% 45%", sizes: D2, fit: "regolare",
      desc: "Jeans a gamba lunga color panna, disponibile anche nero. Con l'ecopelliccia e il maglione è il look che adoriamo.",
      pair: ["pelliccia", "maglione-orsetto", "guanti"] },
    { id: "maglione-trecce", world: "donna", cat: "maglieria",
      name: "Maglione a trecce", color: "Panna", price: 45, src: "ind",
      img: ["d-maglione-trecce"], pos: "35% 35%", sizes: D3, fit: "abbondante",
      desc: "Corto, a trecce, color panna. Tabacco e panna sono i colori di quest'anno: con il pantatuta baggy e l'ecopelliccia.",
      pair: ["pelliccia", "gonna-paillettes", "borsa-ecopelliccia"] },
    { id: "felpa-applicazioni", world: "donna", cat: "maglieria", brand: "Susymix",
      name: "Felpa con applicazioni", color: "Nero", price: 45, src: "ind",
      img: ["d-felpa-applicazioni"], pos: "35% 40%", sizes: D, fit: "regolare",
      desc: "Felpa nera con le applicazioni gioiello e l'interno in pile.",
      pair: ["jeans-panna", "sciarpa-maculata", "cappello"] },
    { id: "blazer-velluto", world: "donna", cat: "giacche",
      name: "Blazer in velluto", color: "Panna", price: 79, src: "ind",
      img: ["d-blazer-velluto"], pos: "30% 40%", sizes: D2, fit: "regolare",
      desc: "Blazer monopetto in velluto: parte del completo con il pantalone palazzo, ma si porta anche da solo sul jeans.",
      pair: ["maglione-orsetto", "abito-paillettes", "spilla"] },
    { id: "guanti", world: "donna", cat: "accessori",
      name: "Guanti in ecopelliccia", color: "Camel, moro e nero", price: 19, src: "ind",
      img: ["d-guanti"], pos: "70% 45%", sizes: UNICA, fit: "unica",
      desc: "Morbidi e caldi, disponibili in camel, moro e nero.",
      pair: ["cappotto-bordeaux", "pelliccia", "sciarpa-maculata"] },
    { id: "cappello", world: "donna", cat: "accessori",
      name: "Cappello in velluto", color: "Verde", price: 19, src: "ind",
      img: ["d-cappello"], pos: "40% 30%", sizes: UNICA, fit: "unica",
      desc: "Berretto con visiera in velluto, per finire il look.",
      pair: ["felpa-applicazioni", "maglione-orsetto", "guanti"] },
    { id: "sciarpa-maculata", world: "donna", cat: "accessori",
      name: "Sciarpa maculata", price: 10, src: "post 10.12.2024",
      img: ["d-sciarpa-maculata"], pos: "15% 40%", sizes: UNICA, fit: "unica",
      desc: "La sciarpa maculata che sta bene con tutto.",
      pair: ["maglione-orsetto", "cappotto-bordeaux", "guanti"] },
    { id: "spilla", world: "donna", cat: "accessori",
      name: "Spilla gioiello", price: 13, src: "post 28.11.2024",
      img: ["d-spilla"], pos: "50% 30%", sizes: UNICA, fit: "unica",
      desc: "La spilla che cambia un blazer. Abbinala agli orecchini e alla collana a doppia catenina.",
      pair: ["blazer-velluto", "giacca-velluto", "abito-paillettes"] },

    { id: "camicia-righe", world: "donna", cat: "camicie",
      name: "Camicia a righe da annodare", color: "Azzurro e bianco", price: 45, src: "ind",
      img: ["d-camicia-righe"], pos: "50% 30%", sizes: D, fit: "regolare",
      desc: "Righe azzurre e fiori ricamati, si annoda davanti in vita. Per chi ama le camicie: con lo shorts bianco o sul jeans.",
      pair: ["jeans-panna", "borsa-ecopelliccia", "spilla"] },
    { id: "top-raso", world: "donna", cat: "camicie", brand: "Susymix",
      name: "Top in raso con pizzo", color: "Nero, in vari colori", price: 39, src: "post 01.10.2025",
      img: ["d-top-raso"], pos: "50% 30%", sizes: D3, fit: "regolare",
      desc: "Top a bretelline in raso con il bordo in pizzo, in vari colori. Sotto il blazer o da solo, con il jeans.",
      pair: ["blazer-velluto", "giacca-velluto", "jeans-panna"] },

    // ---------- IL LOOK DELLA SETTIMANA (post 26.11.2024: "Brown, abbinalo così") ----------
    { id: "pantalone-palazzo", world: "donna", cat: "pantaloni", look: "brown",
      name: "Pantalone palazzo con doppio bottone", color: "Marrone", price: 69, src: "post 26.11.2024",
      img: ["look-brown"], pos: "10% 85%", sizes: D2, fit: "regolare",
      desc: "Pantalone palazzo a vita alta con doppio bottone. Fa parte del look «Brown, abbinalo così».",
      pair: ["blusa-raso", "gilet-quadri", "pochette"] },
    { id: "blusa-raso", world: "donna", cat: "camicie", look: "brown",
      name: "Blusa in raso", color: "Panna", price: 39.99, src: "post 26.11.2024",
      img: ["look-brown"], pos: "60% 90%", sizes: D, fit: "regolare",
      desc: "Blusa in raso color panna: sotto il gilet a quadri e con il palazzo marrone.",
      pair: ["pantalone-palazzo", "gilet-quadri", "pochette"] },
    { id: "gilet-quadri", world: "donna", cat: "camicie", look: "brown", brand: "Susymix",
      name: "Gilet a quadri", color: "Nero e panna", price: 29.9, src: "post 26.11.2024",
      img: ["look-brown"], pos: "95% 35%", sizes: D3, fit: "regolare",
      desc: "Gilet a quadri con il bordo in maglia. Fa parte del look «Brown, abbinalo così».",
      pair: ["blusa-raso", "pantalone-palazzo", "pochette"] },
    { id: "pochette", world: "donna", cat: "accessori", look: "brown",
      name: "Pochette metallizzata", price: 15, src: "post 26.11.2024",
      img: ["look-brown"], pos: "25% 25%", sizes: UNICA, fit: "unica",
      desc: "Pochette metallizzata con la scritta «Love», da mano o con la catena.",
      pair: ["blusa-raso", "gilet-quadri", "pantalone-palazzo"] },

    // ---------- KIDS ----------
    { id: "k-coordinato-nascita", world: "kids", cat: "nascita", novita: true, brand: "Mayoral",
      name: "Coordinato nascita in maglia", price: 49, src: "ind",
      img: ["k-set-maglia"], pos: "50% 50%", sizes: NB, fit: "neonato",
      desc: "Stile, eleganza e comfort già dai primi giorni di vita: il coordinato in maglia della nuova collezione Mayoral.",
      pair: ["k-bavaglini", "k-confezione-pb", "k-set-dino"] },
    { id: "k-set-dino", world: "kids", cat: "nascita", novita: true, brand: "Mayoral",
      name: "Set con dinosauri", price: 45, src: "ind",
      img: ["k-set-dino"], pos: "50% 50%", sizes: NB2, fit: "neonato",
      desc: "Il set perfetto per i più piccoli: comodo e morbido, con i dinosauri.",
      pair: ["k-coordinato-nascita", "k-bavaglini", "k-rosso"] },
    { id: "k-quadri", world: "kids", cat: "bimba", novita: true, brand: "Petit Bateau",
      name: "Completi a quadri", price: 59, src: "ind",
      img: ["k-quadri"], pos: "50% 45%", sizes: BB, fit: "regolare-k",
      desc: "Due completi a quadri della collezione Petit Bateau: camicia e pantalone, per lui e per lei.",
      pair: ["k-rosso", "k-felpa-teddy", "k-parka"] },
    { id: "k-rosso", world: "kids", cat: "bimbo", novita: true, brand: "Mayoral",
      name: "Coordinato rosso autunno-inverno", price: 39, src: "ind",
      img: ["k-rosso"], pos: "50% 50%", sizes: BB, fit: "regolare-k",
      desc: "Il rosso: un colore vivace, elegante e perfetto per i bambini. Dalla collezione Mayoral autunno-inverno.",
      pair: ["k-felpa-teddy", "k-quadri", "k-parka"] },
    { id: "k-felpa-teddy", world: "kids", cat: "bimbo", novita: true,
      name: "Felpa teddy e pantalone in velluto", price: 45, src: "ind",
      img: ["k-felpa-teddy"], pos: "40% 45%", sizes: BB, fit: "regolare-k",
      desc: "Felpa teddy con cappuccio e pantalone in velluto: caldo e comodo per tutti i giorni.",
      pair: ["k-rosso", "k-quadri", "k-parka"] },
    { id: "k-parka", world: "kids", cat: "bimba", novita: true,
      name: "Parka blu con cuori", price: 59, src: "ind",
      img: ["k-parka"], pos: "25% 40%", sizes: RG, fit: "regolare-k",
      desc: "Parka blu con i cuori rosa, da portare con il maglione panna e il pantalone rosa.",
      pair: ["k-quadri", "k-felpa-teddy", "k-rosso"] },
    { id: "k-abito-cerimonia", world: "kids", cat: "cerimonia", brand: "Petit Bateau",
      name: "Abito con colletto a balze", color: "Bianco", price: 69, src: "ind",
      img: ["k-cerimonia"], pos: "40% 50%", sizes: NB2, fit: "regolare-k",
      desc: "Abito bianco con il colletto a balze e la gonna in tulle: per il battesimo e le cerimonie.",
      pair: ["k-confezione-pb", "k-coordinato-nascita", "k-bavaglini"] },
    { id: "k-bavaglini", world: "kids", cat: "regalo", brand: "Bamboom",
      name: "Bavaglini", price: 19, src: "ind",
      img: ["k-bavaglini"], pos: "50% 50%", sizes: UNICA, fit: "unica",
      desc: "I nuovi accessori Bamboom per la nascita: un regalo piccolo che si usa tutti i giorni.",
      pair: ["k-coordinato-nascita", "k-confezione-pb", "k-set-dino"] },
    { id: "k-confezione-pb", world: "kids", cat: "regalo", brand: "Petit Bateau",
      name: "Body in confezione regalo", price: 35, src: "ind",
      img: ["k-scatola"], pos: "50% 50%", sizes: { "1 mese": 2, "3 mesi": 2, "6 mesi": 3, "12 mesi": 1 }, fit: "neonato",
      desc: "Body Petit Bateau nella loro confezione: il regalo di nascita pronto da portare.",
      pair: ["k-bavaglini", "k-coordinato-nascita", "k-set-dino"] }
  ];

  const cats = {
    donna: [
      ["novita", "Novità"], ["abiti", "Abiti e completi"], ["maglieria", "Maglieria"],
      ["pantaloni", "Pantaloni e gonne"], ["giacche", "Giacche e cappotti"],
      ["camicie", "Camicie e top"], ["accessori", "Accessori e borse"], ["ultimi", "Ultimi pezzi"]
    ],
    kids: [
      ["nascita", "Nascita 0–24 mesi"], ["bimba", "Bimba"], ["bimbo", "Bimbo"],
      ["cerimonia", "Cerimonia e Battesimo"], ["regalo", "Idee regalo"]
    ]
  };

  const fit = {
    regolare: "Veste regolare: prendi la tua solita taglia.",
    abbondante: "Veste abbondante: se sei tra due taglie, prendi la più piccola.",
    aderente: "Modello aderente: se sei tra due taglie, prendi la più grande.",
    unica: "Taglia unica.",
    neonato: "Per i neonati consigliamo una taglia in più: crescono in fretta.",
    "regolare-k": "Veste regolare: scegli la taglia dell'età."
  };

  const look = {
    id: "brown",
    title: "Brown, abbinalo così",
    img: "look-brown",
    items: ["pantalone-palazzo", "blusa-raso", "gilet-quadri", "pochette"]
  };

  const reviews = [
    { text: "…scoprire questo meraviglioso negozio, la proprietaria è stupenda, accogliente, sa consigliarmi, disponibile, come la sua collaboratrice, grazie di cuore, a presto",
      name: "Emma D.", src: "Google · KIOS Kids · ottobre 2026" },
    { text: "Il mio negozio preferito; la gentilezza di Eleonora è infinita e i capi meravigliosi",
      name: "Nico T.", src: "Facebook · 2022" },
    { text: "Ottimo negozio, per ragazze e donne Si trova sempre delle belle cose. Il personale è gentilissimo e molto preparato.",
      name: "Maude Lise K.", src: "Facebook · 2017" },
    { text: "Negozio abbigliamento e accessori veramente giusto! Anche se in un piccolo centro ! Personale molto attento e molto simpatici",
      name: "Renata P.", src: "Facebook · 2017" }
  ];

  return { products, cats, fit, look, reviews };
})();
