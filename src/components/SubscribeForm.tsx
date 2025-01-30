import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import {
  DialogBackdrop,
  DialogDescription,
  DialogWrap,
} from "@/components/primitives/Dialog";
import { Button } from "@/components/primitives/Button";
import { Field, Label } from "@/components/primitives/Fieldset";
import { Input, InputGroup } from "@/components/primitives/Input";
import { Kbd } from "@/components/primitives/Keybinding";
import { Mail, Bell } from "lucide-react";

export function SubscribeForm() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const dialogTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't run the keybindings when focused on editable surfaces
      const isEditableElement =
        ["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName) ||
        (event.target as HTMLElement).getAttribute("contenteditable") ===
          "true" ||
        (event.target as HTMLElement).closest('[contenteditable="true"]') !==
          null;

      if (isEditableElement) {
        return;
      }

      if (event.key === "b" || event.key === "B") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

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
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to subscribe",
      );
    }
  };

  return (
    <BaseDialog.Root dismissible open={isOpen} onOpenChange={setIsOpen}>
      <BaseDialog.Trigger
        ref={dialogTriggerRef}
        render={
          <Button
            size="xs"
            variant="outline"
            aria-label="Be Notified About New Roles"
            className="w-8 sm:w-auto"
          >
            <Bell size={10} fill="currentColor" className="hidden sm:block" />
            <Bell size={12} fill="currentColor" className="block sm:hidden" />
            <Kbd char="B" />
          </Button>
        }
      />
      <BaseDialog.Portal>
        <DialogBackdrop />
        <DialogWrap title="Be notified about new roles">
          <DialogDescription>
            Get an email every time a company adds a new role.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="w-full">
            <Field>
              <Label className="flex items-center justify-between gap-0.5">
                Your Email
                <span>
                  <AnimatePresence>
                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-red-700 dark:text-red-300"
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                    {status === "success" && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-green-700 dark:text-green-400"
                      >
                        You&apos;re in! Thanks for subscribing.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </span>
              </Label>
              <InputGroup data-slot="icon" className="w-full">
                <Mail data-slot="icon" className="size-4" />
                <Input
                  ref={emailInputRef}
                  startSlot
                  keybinding
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="w-full"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === "loading" || status === "success"}
                  className="mt-2 w-full"
                >
                  {status === "loading"
                    ? "Subscribing..."
                    : status === "success"
                      ? "Subscribed!"
                      : "Subscribe"}
                </Button>
              </InputGroup>
            </Field>
          </form>
        </DialogWrap>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
