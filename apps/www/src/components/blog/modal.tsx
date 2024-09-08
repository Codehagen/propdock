"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { Drawer } from "vaul";

import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export default function Modal({
  children,
  className,
  dialogOnly,
  showModal,
  setShowModal,
  onClose,
  preventDefaultClose
}: {
  children: React.ReactNode;
  className?: string;
  dialogOnly?: boolean;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  preventDefaultClose?: boolean;
}) {
  const router = useRouter();

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    onClose?.();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
      // else, this is intercepting route @modal
    } else {
      router.back();
    }
  };
  const { isMobile } = useMediaQuery();

  if (isMobile && !dialogOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={open => {
          if (!open) {
            closeModal({ dragged: true });
          }
        }}
      >
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              "fixed right-0 bottom-0 left-0 z-50 mt-24 rounded-t-[10px] border-gray-200 border-t bg-white",
              className
            )}
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <Dialog.Root
      open={setShowModal ? showModal : true}
      onOpenChange={open => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="fixed inset-0 z-40 animate-fade-in bg-gray-100 bg-opacity-50 backdrop-blur-md"
        />
        <Dialog.Content
          onOpenAutoFocus={e => e.preventDefault()}
          onCloseAutoFocus={e => e.preventDefault()}
          className={cn(
            "fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md animate-scale-in overflow-hidden border border-gray-200 bg-white p-0 shadow-xl md:rounded-2xl",
            className
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
