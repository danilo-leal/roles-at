import * as React from "react";
import Link from "next/link";
import clsx from "clsx";
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

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(true);

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
        {/* <Logo /> */}
        {/* <JumpToContent /> */}
        <div className="flex items-center gap-2.5">
          <Link href="/">Home</Link>
          <Link href="/">About</Link>
          <Link href="/admin">Admin</Link>
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
