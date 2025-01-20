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
        url: "https://i.postimg.cc/63378CMd/og.png",
        alt: title,
        width: 1280,
        height: 720,
      },
    ],
  },
  // twitter: {
  //   handle: "@danilobleal",
  //   site: "@danilobleal",
  //   cardType: "summary_large_image",
  // },
};

export default SEO;
