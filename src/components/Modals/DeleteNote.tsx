import { Dialog } from "@headlessui/react";
import React from "react";
import { Note } from "../..";
import Button from "../Button";
import ModalLayout from "../Layouts/Modal";

function DeleteNoteModal({
  open,
  onClose,
  selectedNote,
  setSelectedNoteId,
  deleteNote,
}: {
  open: boolean;
  onClose: (newOpen: boolean) => void;
  selectedNote: Note;
  setSelectedNoteId: (newId: string | null) => void;
  deleteNote: (noteId: string) => void;
}) {
  return (
    <ModalLayout open={open} onClose={onClose}>
      {/* Title & Description */}
      <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white">
        Delete note
      </Dialog.Title>
      <Dialog.Description className="hidden">
        This dialog will delete a note
      </Dialog.Description>

      <p className="text-gray-950 dark:text-gray-300">
        Are you sure you want to delete this note? This cannot be undone.
      </p>

      <Button
        icon="trash"
        intent="dangerPrimary"
        label="Yes, delete this note"
        tooltipPosition="right"
        tooltipAlignment="yCenter"
        onClick={() => {
          setSelectedNoteId(null);
          deleteNote(selectedNote.id);
        }}
        size="rectangle"
      />
    </ModalLayout>
  );
}

export default DeleteNoteModal;
