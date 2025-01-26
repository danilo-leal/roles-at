import { useState, useRef, useEffect } from "react";
import { Input, InputGroup } from "./Input";
import { Mail } from "lucide-react";
import { Kbd } from "./Keybinding";
import clsx from "clsx";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if any input/textarea is focused
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key.toLowerCase() === "n" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        emailInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to subscribe");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2">
        <InputGroup data-slot="subscribe" className="w-full">
          <Mail data-slot="icon" className="size-4" />
          <Input
            ref={emailInputRef}
            startSlot
            keybinding
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            required
            className="w-full"
          />
          <div className="hidden absolute inset-y-0 right-20 sm:flex items-center gap-1">
            <Kbd char="N" />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={clsx(
              "shrink-0 px-4 py-2 text-sm font-medium rounded-md",
              "transition-colors duration-150",
              status === "success"
                ? "bg-green-500 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white",
              (status === "loading" || status === "success") && "opacity-50 cursor-not-allowed"
            )}
          >
            {status === "loading"
              ? "Subscribing..."
              : status === "success"
              ? "Subscribed!"
              : "Subscribe"}
          </button>
        </InputGroup>
        {status === "error" && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}
        {status === "success" && (
          <p className="text-green-600 dark:text-green-400 text-sm">
            Thanks for subscribing! You'll receive updates about new roles.
          </p>
        )}
      </div>
    </form>
  );
} 
