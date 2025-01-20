import * as React from "react";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { Kbd } from "@/components/primitives/Keybinding";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

// function JumpToContent() {
//   return (
//     <Button
//       external="true"
//       href="#selfie"
//       variant="plain"
//       color="neutral"
//       className="absolute left-16 translate-y-[-300%] transition-transform focus:translate-y-0"
//     >
//       Jump to content
//     </Button>
//   );
// }

function Logo() {
  return (
    <Link href="/" className="mr-3">
      <svg
        width="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 46h2v-4h-2v4Zm-6-11v2h4v-2h-4Zm-1-23.5h-2v4h2v-4ZM24 42c-9.941 0-18-8.059-18-18H2c0 12.15 9.85 22 22 22v-4ZM6 24c0-9.941 8.059-18 18-18V2C11.85 2 2 11.85 2 24h4ZM24 6c9.941 0 18 8.059 18 18h4c0-12.15-9.85-22-22-22v4Zm-6 7.5V35h4V13.5h-4Zm2 2c1.806 0 3.356-.031 4.774.007 1.414.038 2.507.144 3.34.364.813.216 1.211.497 1.43.773.214.269.456.78.456 1.856h4c0-1.674-.383-3.162-1.326-4.347-.936-1.177-2.226-1.802-3.537-2.149-1.293-.342-2.762-.455-4.255-.495-1.488-.04-3.189-.009-4.882-.009v4Zm10 3c0 1.178-.19 1.88-.394 2.293-.186.375-.42.59-.721.748-.787.412-1.98.459-3.885.459v4c1.594 0 3.902.047 5.74-.916a5.571 5.571 0 0 0 2.451-2.517c.561-1.134.81-2.495.81-4.067h-4ZM25 24c0 2-.001 2-.002 2H24.979h.014c.021.001.064.003.125.01a5.304 5.304 0 0 1 2.3.798C28.544 27.53 30 29.113 30 33h4c0-5.114-2.042-8.03-4.418-9.557a9.302 9.302 0 0 0-4.098-1.417 6.563 6.563 0 0 0-.458-.026h-.023C25 22 25 22 25 24Zm5 9c0 2.354 1.07 4.268 2.849 5.332 1.717 1.026 3.85 1.118 5.808.437C42.685 37.37 46 32.837 46 25.5h-4c0 6.163-2.685 8.805-4.657 9.491-1.041.362-1.91.226-2.442-.093-.47-.28-.9-.829-.9-1.898h-4ZM20 11.5h-3v4h3v-4ZM42 24v1.5h4V24h-4Z"
          fill="currentColor"
        />
      </svg>
    </Link>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(true);
  const { pathname } = useRouter();

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    setMounted(!mounted);
  }, [theme, setTheme, mounted, setMounted]);

  React.useEffect(() => {
    setMounted(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "j") {
        event.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleTheme]);

  return (
    <header>
      <nav
        className={clsx(
          "py-8 isolate w-full",
          "flex justify-between items-center rounded-none sm:rounded-full",
          // "bg-white/60 dark:bg-black/30",
          // "border-b sm:border border-zinc-300/50 dark:border-zinc-400/10",
        )}
      >
        {/* <JumpToContent /> */}
        <div className="flex items-center">
          <Logo />
          <Button variant={pathname === "/" ? "outline" : "ghost"} href="/">
            Openings
            {pathname === "/" && (
              <div className="absolute bottom-[-5px] w-6 h-[2px] bg-red-500 rounded-b-full" />
            )}
          </Button>
          <Button variant={pathname === "/" ? "outline" : "ghost"} href="/">
            About
            {pathname === "/" && (
              <div className="absolute bottom-[-5px] w-6 h-[2px] bg-red-500 rounded-b-full" />
            )}
          </Button>
          <Button
            variant={pathname === "/admin" ? "outline" : "ghost"}
            href="/admin"
          >
            Admin
            {pathname === "/admin" && (
              <div className="absolute bottom-[-5px] w-6 h-[2px] bg-red-500 rounded-b-full" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2.5">
          <Tooltip
            trigger={
              <Button square onClick={toggleTheme}>
                {theme === "dark" ? <Sun /> : <Moon />}
              </Button>
            }
            content={
              <div className="flex items-center gap-2">
                Toggle Mode
                <span className="flex items-center gap-1">
                  <Kbd char="⌘" />
                  <Kbd char="J" />
                </span>
              </div>
            }
          />
          <Button href="/submit">Submit Opening</Button>
        </div>
      </nav>
    </header>
  );
}
