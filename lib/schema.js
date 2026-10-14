import { site, tutor, contact, socials, subjects, faqs } from "./site";

const hasRealPhone = () => Boolean(contact.whatsapp);

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "ProfessionalService"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    areaServed: [
      { "@type": "City", name: site.location.city },
      { "@type": "Country", name: site.location.country },
      "Worldwide (online)",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: "WA",
      addressCountry: "AU",
    },
    ...(hasRealPhone() && { telephone: `+${contact.whatsapp}` }),
    email: contact.email,
    founder: { "@id": `${site.url}/about#tutor` },
    sameAs: socials.map((s) => s.href),
    knowsAbout: subjects.map((s) => s.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tutoring subjects",
      itemListElement: subjects.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${s.name} tutoring, Years 7–12`,
          serviceType: "Tutoring",
          provider: { "@id": `${site.url}/#organization` },
        },
      })),
    },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/about#tutor`,
    name: tutor.name,
    jobTitle: tutor.role,
    url: `${site.url}/about`,
    worksFor: { "@id": `${site.url}/#organization` },
    knowsAbout: ["Mechanical engineering", ...subjects.map((s) => s.name)],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressCountry: "AU",
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
