import { description } from "@/utils/seo";

const title = "Roles.at";

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
};

export default SEO;
