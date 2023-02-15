import { Dialog } from "@headlessui/react";
import { type ReactNode } from "react";

function ModalLayout({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: (newOpen: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-25">
        <Dialog.Panel className="w-[90%] space-y-6 rounded-lg bg-white px-6 py-6 md:w-[500px] md:px-10">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ModalLayout;
