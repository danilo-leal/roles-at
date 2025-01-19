import * as React from "react";
import clsx from "clsx";
// import Link from "next/link";
// import * as Tooltip from "@radix-ui/react-tooltip";
// import ScrollBar from "./ScrollBar";
// import DarkModeButton from "./DarkModeButton";
import { Button } from "@/components/primitives/Button";
// import MenuButton from "./MenuButton";
// import Logo from "./Logo";
// import CommandKButton from "./CommandKButton";
// import { KbdTag } from "@/components/atoms/Keybinding";
// import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";

const navElement = clsx(
  "p-2.5 backdrop-blur-md w-full m-auto max-w-[920px]",
  "flex justify-between items-center rounded-none sm:rounded-full",
  "bg-white/60 dark:bg-black/30",
  "border-b sm:border border-gray-300/50 dark:border-gray-400/10",
);

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
      <nav className={navElement}>
        {/* <Logo /> */}
        {/* <JumpToContent /> */}
        <div className="flex items-center gap-2.5">
          <p>Home</p>
          <p>About</p>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Submit Opening
          </Button>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Toggle Theme
          </Button>
          {/* <MenuButton /> */}
          {/* <CommandKButton /> */}
          {/* <DarkModeButton /> */}
        </div>
      </nav>
    </header>
  );
}
