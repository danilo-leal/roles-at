import React from "react";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { useRouter } from "next/router";

import clsx from "clsx";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Dialog({ isOpen, onClose }: DialogProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push("/", undefined, { shallow: true });
    onClose();
  };

  return (
    <BaseDialog.Root open={isOpen} onOpenChange={handleClose}>
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
            "w-full sm:w-[700px] max-h-[80vh] sm:max-h-[700px] overflow-clip",
            "bg-gray-50 text-gray-900",
            "dark:bg-neutral-950 text-gray-900",
            "border default-border-color",
            "outline-none shadow-2xl",
            "transition-all duration-150",
            "data-[ending-style]:scale-90 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-90 data-[starting-style]:opacity-0"
          )}
        >
          <div className="grow flex flex-col size-full overflow-y-auto">
            <BaseDialog.Title className="-mt-1.5 px-5 pt-5 pb-4 text-lg dark:text-white font-medium border-b default-border-color">
              Job Opening
            </BaseDialog.Title>
            <BaseDialog.Description className="relative size-full p-5 overflow-y-auto"></BaseDialog.Description>
          </div>
          {/* <Dialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close> */}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
