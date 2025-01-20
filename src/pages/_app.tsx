import { useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Container } from "@/components/primitives/Container";
import { AuthOnlyRoute } from "@/components/AuthOnlyRoute";

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();

  return (
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
        <Container>
          {router.pathname === "/admin" ? (
            <AuthOnlyRoute>
              <Component {...pageProps} />
            </AuthOnlyRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </Container>
      </ThemeProvider>
    </SessionContextProvider>
  );
}
