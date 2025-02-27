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
        <link
          rel="icon"
          href="/favicon.ico"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.ico"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <body className="antialiased bg-white dark:bg-black/50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
