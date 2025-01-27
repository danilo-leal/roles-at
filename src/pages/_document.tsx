import { Html, Head, Main, NextScript } from "next/document";
import { title, description } from "../../next-seo.config";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta
          key="title"
          property="og:title"
          name={title}
          content={description}
        />
      </Head>
      <body className="antialiased bg-white dark:bg-black/50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
