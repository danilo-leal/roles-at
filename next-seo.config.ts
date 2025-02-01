export const title = "roles.at";
export const description =
  "High-quality software design roles. Alternative to Read.cv.";
export const descriptionOg =
  "Find high-quality software design and engineering roles.";

const SEO = {
  title,
  description,
  canonical: "https://roles.at",
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://roles.at",
    title,
    description,
    images: [
      {
        url: "https://roles.at/api/og",
        alt: title,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    // handle: "@danilobleal",
    // site: "@danilobleal",
    cardType: "summary_large_image",
  },
};

export default SEO;
