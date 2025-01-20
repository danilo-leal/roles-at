import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";

type AuthOnlyRouteProps = {
  children: React.ReactNode;
};

export function AuthOnlyRoute({ children }: AuthOnlyRouteProps) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  if (!session) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
