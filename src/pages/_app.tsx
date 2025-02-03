import * as React from "react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Container } from "@/components/primitives/Container";
import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = React.useState(() => createPagesBrowserClient());

  return (
    <ErrorBoundary>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DefaultSeo {...SEO} />
          <Container>
            <Component {...pageProps} />
          </Container>
          <Analytics />
        </ThemeProvider>
      </SessionContextProvider>
    </ErrorBoundary>
  );
}
