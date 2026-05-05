/**
 * Contenu éditorial — page À propos (mission, vision, impact, charte).
 * Source validée côté produit ; texte affiché via `components/about/AboutPage.tsx`.
 */
export const aboutPageData = {
  pageTitle: "À propos",
  pageIntro:
    "International Business Alliance — matériaux, partenariats et standards au service de la construction durable.",

  mission: {
    waterNumber: "01",
    badge: "Notre mission",
    kicker: "01 — Notre mission",
    headline: "Approvisionner, soutenir et",
    headlineAccent: "construire durablement.",
    intro:
      "Mettre à disposition des professionnels et des particuliers des matériaux de qualité pour garantir la réussite de leurs projets de construction. Nous nous engageons à offrir des solutions adaptées, un service efficace et un accompagnement de proximité pour chaque chantier.",
    narrativeTitle: "Une force qui bâtit l’avenir",
    narrativeLead:
      "Nous sommes la force qui bâtit l’avenir — une confiance qui s’inscrit dans la durée et à l’échelle mondiale.",
    narrativeBody:
      "Nous ne nous contentons pas de fournir des matériaux. Nous accompagnons nos partenaires et nos clients dans la réalisation de projets fiables et durables, en favorisant la transparence, la sécurité et la qualité.",
    international: {
      title: "Portée internationale",
      body:
        "IBA collabore avec des partenaires et fournisseurs étrangers et locaux, et respecte des standards internationaux, ce qui lui permet de s’inscrire dans une dynamique d’ouverture sur le marché international des matériaux de construction.",
    },
  },

  vision: {
    waterNumber: "02",
    badge: "Notre vision",
    kicker: "02 — Notre vision",
    headline: "Être un partenaire de",
    headlineAccent: "référence dans la construction.",
    intro:
      "Un avenir où chaque projet, petit ou grand, repose sur des matériaux solides et un approvisionnement fiable. Nous aspirons à devenir un acteur clé du secteur en contribuant activement au développement urbain et à la modernisation des infrastructures.",
  },

  focusAreas: {
    waterNumber: "03",
    badge: "Notre impact",
    kicker: "03 — Axes d’action",
    headline: "Agir avec",
    headlineAccent: "exigence et mesure",
    intro:
      "Trois leviers complémentaires pour ancrer notre mission dans des résultats concrets sur le terrain.",
    cards: [
      {
        id: "impact",
        title: "Impact ciblé",
        body:
          "IBA vise à améliorer durablement le secteur de la construction en fournissant des matériaux de qualité, en contribuant au développement des infrastructures et en participant à la croissance économique locale et régionale.",
      },
      {
        id: "projects",
        title: "Nos projets",
        body:
          "Une trajectoire de chantiers et de partenariats qui illustrent notre capacité à livrer, à respecter les normes et à tenir nos engagements opérationnels.",
        ctaLabel: "Explorer",
        ctaHref: "/projects",
      },
      {
        id: "governance",
        title: "Gouvernance éthique",
        body:
          "IBA adopte une gestion transparente et responsable, fondée sur l’intégrité, le respect des normes, la conformité légale et l’engagement envers ses partenaires, employés et clients.",
      },
    ],
  },

  charter: {
    waterNumber: "04",
    badge: "Notre charte",
    kicker: "04 — Valeurs & principes",
    headline: "Notre",
    headlineAccent: "philosophie",
    intro:
      "Chez IBA, nous croyons que le développement du secteur de la construction repose sur une gestion responsable, des partenariats solides et une vision durable. Notre approche valorise le savoir-faire local tout en s’alignant sur les standards internationaux.",
    principles: [
      "Intégrité et transparence",
      "Développement durable",
      "Innovation collaborative",
      "Responsabilité sociale",
    ],
  },
} as const;
