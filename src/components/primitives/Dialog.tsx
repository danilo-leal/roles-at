import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { Button } from "./Button";

export default function Dialog({
  onClose,
  children,
}: {
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger>
        <Button variant="primary" size="md" className="hidden sm:flex ml-auto">
          Apply for this position
        </Button>
      </BaseDialog.Trigger>
      <BaseDialog.Portal keepMounted>
        <BaseDialog.Backdrop />
        <BaseDialog.Popup>
          {children}
          <div>
            <BaseDialog.Close onClick={onClose}>Close</BaseDialog.Close>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
