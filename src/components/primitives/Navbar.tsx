import * as React from "react";
import Link from "next/link";
import clsx from "clsx";
import { Drawer } from "vaul";
import { motion } from "motion/react";
import { useRouter } from "next/router";
import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { Kbd } from "@/components/primitives/Keybinding";
import { useTheme } from "next-themes";
import { useSession } from "@supabase/auth-helpers-react";
import { Sun, Moon, ChevronRight } from "lucide-react";

function Logo() {
  return (
    <Link
      href="/"
      className="rounded-full mr-2 fv-style"
      aria-label="Go To Home"
    >
      <motion.div
        whileHover={{ rotateY: 360 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
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
      </motion.div>
    </Link>
  );
}

function MobileMenu() {
  const linkStyles =
    "font-medium p-4 border-b flex items-center justify-between dark:border-zinc-600/20";
  const iconStyles = "size-4 text-orange-500 dark:text-orange-400";

  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>
        <Button
          square
          aria-label="Toggle Color Mode"
          className="flex sm:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-3.5 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/80 z-[110]" />
        <Drawer.Content
          className={clsx(
            "mt-24 fixed bottom-0 left-0 right-0 z-[120]",
            "shadow-[0_-4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.6)]",
            "focus-visible:outline-none focus:outline-none",
            "bg-white dark:bg-zinc-950",
            "rounded-t-[12px] flex-1",
            "border dark:border-gray-500/10",
          )}
        >
          <div className="mx-auto w-8 h-1 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-500/30 my-4" />
          <Link href="/my-world/thinking" className={linkStyles}>
            See All Roles
            <ChevronRight className={iconStyles} />
          </Link>
          <Link href="/about" className={clsx(linkStyles, "border-b-0")}>
            Learn About Us
            <ChevronRight className={iconStyles} />
          </Link>
          <span className="p-4 flex">
            <Button href="/submit" variant="primary" className="w-full">
              Submit Role
            </Button>
          </span>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { pathname, push } = useRouter();
  const session = useSession();

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  React.useEffect(() => {
    setMounted(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key) {
        switch (event.key.toLowerCase()) {
          case "j":
            if (event.metaKey) {
              event.preventDefault();
              toggleTheme();
            }
            break;
          case "r":
            event.preventDefault();
            push("/");
            break;
          case "a":
            event.preventDefault();
            push("/about");
            break;
          case "s":
            event.preventDefault();
            push("/submit");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleTheme, push]);

  function HighlightPattern() {
    return (
      <div
        className={clsx(
          "pattern-diagonal-lines [--pattern-color:_#ea580c] pattern-bg-white",
          "pattern-size-1 pattern-opacity-20 dark:[--pattern-bg-color:_transparent]",
          "[z-index:-1] absolute inset-0 pointer-events-none select-none",
        )}
      />
    );
  }

  return (
    <header>
      <nav
        className={clsx(
          "pt-8 w-full",
          "flex justify-between items-center rounded-none sm:rounded-full",
        )}
      >
        <div className="flex items-center gap-1">
          <Logo />
          <Button
            variant={pathname === "/" ? "outline" : "ghost"}
            href="/"
            className="hidden sm:inline-flex relative overflow-clip"
          >
            Roles
            <Kbd char="R" />
            {pathname === "/" && <HighlightPattern />}
          </Button>
          <Button
            variant={pathname === "/about" ? "outline" : "ghost"}
            href="/about"
            className="hidden sm:inline-flex relative"
          >
            About
            <Kbd char="A" />
            {pathname === "/about" && <HighlightPattern />}
          </Button>
          {session && (
            <Button
              variant={pathname === "/admin" ? "outline" : "ghost"}
              href="/admin"
              className="hidden sm:inline-flex relative"
            >
              Admin
              {pathname === "/admin" && <HighlightPattern />}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <Tooltip
            trigger={
              <Button
                square
                onClick={toggleTheme}
                aria-label="Toggle Color Mode"
              >
                {mounted &&
                  (theme === "dark" ? <Sun size={14} /> : <Moon size={14} />)}
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
          <Button href="/submit">
            Submit Role <Kbd char="S" />
          </Button>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
