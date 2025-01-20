import { NextSeo } from "next-seo";

export const description =
  "A nicely designed, single-purpose job board. Alternative to Read.cv.";

export default function NextSeoHeader({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <NextSeo
      title={`Roles.at－${title}`}
      description={description}
      canonical={`https://roles.at${url}`}
      openGraph={{
        title: `Roles.at－${title}`,
        description: description,
        url: `https://roles.at${url}`,
        locale: "en_IE",
        images: [
          {
            url: `https://daniloleal.co/api/og?title=${encodeURIComponent(title)}`,
            alt: `Roles.at－${title}`,
            width: 1200,
            height: 630,
          },
        ],
      }}
      // twitter={{
      //   handle: "@danilobleal",
      //   site: "@danilobleal",
      //   cardType: "summary_large_image",
      // }}
    />
  );
}
