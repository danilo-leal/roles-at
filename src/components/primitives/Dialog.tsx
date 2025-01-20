import React, { useState } from "react";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { Button } from "@/components/primitives/Button";
import { Copy, Check } from "@phosphor-icons/react";
import clsx from "clsx";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  email: string;
};

export function Dialog({ open, onClose, email }: DialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true); // Set the copied state to true
        setTimeout(() => setCopied(false), 2000); // Reset the icon after 2 seconds
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <BaseDialog.Root open={open} onOpenChange={onClose} dismissible>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={clsx(
            "fixed inset-0 bg-black/20 dark:bg-zinc-900/10 transition-all duration-150",
            "backdrop-blur-xs",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
          )}
        />
        <BaseDialog.Popup
          className={clsx(
            "fixed bottom-0 sm:top-1/2 left-1/2 -mt-8",
            "-translate-x-1/2 sm:-translate-y-1/2 rounded-b-none sm:rounded-b-lg rounded-t-lg",
            "w-[400px] sm:h-[220px] h-[300px] overflow-clip ",
            "bg-gray-50 text-gray-900",
            "dark:bg-neutral-950 text-gray-900",
            "border default-border-color",
            "outline-none shadow-2xl",
            "transition-all duration-150"
          )}
        >
          <BaseDialog.Title className="-mt-1.5 px-5 pt-5 pb-3 text-lg dark:text-white font-medium border-b default-border-color">
            Send an email 🚀
          </BaseDialog.Title>
          <div className="grow flex flex-col p-3 gap-3 justify-between">
            <BaseDialog.Description>
              <p className="text-sm default-p-color mb-2">
                Click the button below to copy the email address to your
                clipboard and send your application for this role.
              </p>
            </BaseDialog.Description>
            <Button
              variant="outline"
              className="w-full flex items-center"
              onClick={handleCopyEmail}
            >
              {email}
              <span className="relative flex items-center">
                <Copy
                  size={16}
                  className={clsx(
                    "absolute transition-opacity duration-300",
                    copied ? "opacity-0" : "opacity-100"
                  )}
                />
                <Check
                  size={16}
                  className={clsx(
                    "absolute transition-opacity duration-300",
                    copied ? "opacity-100" : "opacity-0"
                  )}
                  color="green"
                />
              </span>
            </Button>
            <Button onClick={onClose} variant="primary" className="w-full">
              Done
            </Button>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
