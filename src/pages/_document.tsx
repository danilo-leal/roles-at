import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta
          property="og:title"
          name="Roles At"
          content="Roles At | Tech Job Board"
          key="title"
        />
      </Head>
      <body className="antialiased bg-white dark:bg-black/50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
