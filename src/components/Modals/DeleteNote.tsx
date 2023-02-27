import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import React from "react";
import { type NoteWithTags } from "../..";
import { api } from "../../utils/api";
import Button from "../Button";
import ModalLayout from "../Layouts/Modal";

function DeleteNoteModal({
  open,
  onClose,
  selectedNote,
}: {
  open: boolean;
  onClose: (newOpen: boolean) => void;
  selectedNote: NoteWithTags;
}) {
  // next router
  const router = useRouter();

  // trpc
  const deleteMutation = api.notes.delete.useMutation();
  const utils = api.useContext();

  // TODO: implement this function
  function onClickDeleteNote() {
    deleteMutation.mutate(
      { id: selectedNote.id },
      {
        onSuccess: (deletedNote, variables, context) => {
          utils.notes.getAll.setData(undefined, (oldNotes) =>
            oldNotes?.filter((oldNote) => oldNote.id !== deletedNote.id)
          );
          void utils.notes.getAll.invalidate();
          void router.push("/notes");
        },
      }
    );
  }
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
        onClick={onClickDeleteNote}
        size="rectangle"
      />
    </ModalLayout>
  );
}

export default DeleteNoteModal;
