import { Dialog, Listbox } from "@headlessui/react";
import { Check } from "phosphor-react";
import { useState } from "react";
import { type Tag, type Note } from "@prisma/client";
import Button from "../Button";
import CaretUpDownIcon from "../CaretUpDownIcon";
import ModalLayout from "../Layouts/Modal";
import TagPill from "../TagPill";
import DeleteNoteModal from "./DeleteNote";
import { NoteWithTags } from "../..";
import { api } from "../../utils/api";

function NoteOptionsModal({
  open,
  onClose,
  selectedNote,
  tags,
}: {
  open: boolean;
  onClose: (newOpen: boolean) => void;
  selectedNote: null | NoteWithTags;
  tags: Tag[];
}) {
  // modal state
  const [noteTitle, setNoteTitle] = useState(
    selectedNote ? selectedNote.title : ""
  );
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const tagsAvailable = selectedNote
    ? tags.filter((t) => {
        const noteTagIds = selectedNote.tags.map((noteTag) => noteTag.id);
        return !noteTagIds.includes(t.id);
      })
    : tags;

  console.log("tagsAvailable:", tagsAvailable);

  // trpc
  const renameMutation = api.notes.rename.useMutation();
  const addTagMutation = api.notes.addTag.useMutation();
  const removeTagMutation = api.notes.removeTag.useMutation();
  const utils = api.useContext();

  // TODO: implement this function
  function onClickRenameNote() {
    //

    if (!selectedNote) return;

    renameMutation.mutate(
      { id: selectedNote.id, newTitle: noteTitle },
      {
        onSuccess: (updatedNote, variables, context) => {
          utils.notes.getAll.setData(undefined, (oldNotes) =>
            oldNotes?.map((oldNote) =>
              oldNote.id === variables.id ? updatedNote : oldNote
            )
          );
          void utils.notes.invalidate();
        },
      }
    );
  }

  // TODO: implement this function
  function onClickAddTagToNote() {
    if (!selectedNote || !selectedTag) return;

    addTagMutation.mutate(
      { id: selectedNote.id, tagId: selectedTag.id },
      {
        onSuccess: (updatedNote, variables, context) => {
          utils.notes.getAll.setData(undefined, (oldNotes) =>
            oldNotes?.map((oldNote) =>
              oldNote.id === variables.id ? updatedNote : oldNote
            )
          );
          void utils.notes.invalidate();
          setSelectedTag(null);
        },
      }
    );
  }

  function onClickRemoveTag(tagId: string) {
    if (!selectedNote) return;

    removeTagMutation.mutate(
      { id: selectedNote.id, tagId },
      {
        onSuccess: (updatedNote, variables, context) => {
          utils.notes.getAll.setData(undefined, (oldNotes) =>
            oldNotes?.map((oldNote) =>
              oldNote.id === updatedNote.id ? updatedNote : oldNote
            )
          );
          void utils.notes.invalidate();
        },
      }
    );
  }

  if (selectedNote === null) return <div></div>;

  return (
    <ModalLayout open={open} onClose={onClose}>
      {/* Title & Description */}
      <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white">
        Note Options
      </Dialog.Title>
      <Dialog.Description className="hidden">
        This dialog allows you to view and modify options for your note
      </Dialog.Description>

      {/* Title */}
      <h3 className="text-xl font-normal text-gray-600 dark:text-gray-400">
        Title
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700  placeholder:text-gray-400 dark:bg-gray-950 dark:text-gray-300 dark:placeholder:text-gray-500"
          placeholder="My awesome note"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <Button
          icon="pencil-simple"
          intent="primary"
          label="Rename note"
          tooltipPosition="bottom"
          tooltipAlignment="xCenter"
          onClick={onClickRenameNote}
          iconOnly
          size="regular"
          disabled={!noteTitle}
          loading={renameMutation.isLoading}
        />
      </div>

      {/* Tags */}
      <h3 className="text-xl font-normal text-gray-600 dark:text-gray-400">
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {selectedNote.tags.length !== 0 ? (
          selectedNote.tags.map((tag: Tag) => (
            <TagPill
              key={tag.id}
              label={tag.label}
              color={tag.color}
              deletable
              onClickDelete={() => onClickRemoveTag(tag.id)}
              loading={
                removeTagMutation.isLoading &&
                removeTagMutation.variables?.tagId === tag.id
              }
            />
          ))
        ) : (
          <span className="text-gray-400">No tags - nothing to see here.</span>
        )}
      </div>

      {/* Add tags */}
      {tagsAvailable.length !== 0 && (
        <>
          <h3 className="text-xl font-normal text-gray-600 dark:text-gray-400">
            Add tags
          </h3>
          {/* New tag color selector */}
          <div className="flex gap-2">
            <Listbox
              as="div"
              value={selectedTag}
              onChange={setSelectedTag}
              className="relative"
            >
              {/* Button */}
              <Listbox.Button className="flex w-56 items-center justify-between gap-4 whitespace-nowrap rounded-lg border-2 border-transparent bg-gray-200 px-3 py-1.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-850">
                {selectedTag ? (
                  selectedTag.label
                ) : (
                  <span className="font-normal text-gray-400">
                    Select a tag to add
                  </span>
                )}
                <CaretUpDownIcon />
              </Listbox.Button>

              {/* Options */}
              <Listbox.Options className="absolute right-0 bottom-full z-20 mb-2 w-full items-center rounded-lg border-2 border-gray-400 bg-gray-200 py-2 drop-shadow-lg dark:border-gray-950 dark:bg-gray-850">
                {tagsAvailable.map((tag, index) => (
                  <Listbox.Option
                    key={index}
                    className="flex items-center whitespace-nowrap py-1 pl-2 pr-6 text-gray-900 ui-active:bg-blue-200 ui-active:text-blue-600 dark:text-gray-100 dark:ui-active:bg-blue-900 dark:ui-active:bg-opacity-60"
                    value={tag}
                  >
                    <Check
                      weight="bold"
                      size={20}
                      className="ml-1 mr-2 text-blue-500 opacity-0 ui-selected:opacity-100 ui-active:text-blue-600 dark:ui-active:text-blue-400"
                    />
                    {tag.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>

            <Button
              icon="plus"
              intent="primary"
              label="Add tag to note"
              tooltipPosition="bottom"
              tooltipAlignment="xCenter"
              onClick={onClickAddTagToNote}
              iconOnly
              size="regular"
              disabled={!selectedTag}
              loading={addTagMutation.isLoading}
            />
          </div>
        </>
      )}

      {/* Danger Zone */}
      <h3 className="text-xl font-normal text-gray-600 dark:text-gray-400">
        Danger zone
      </h3>
      <Button
        icon="trash"
        intent="dangerSecondary"
        label="Delete note"
        tooltipPosition="right"
        tooltipAlignment="yCenter"
        onClick={() => setDeleteModalOpen(true)}
        size="rectangle"
      />

      {/* Delete note modal */}
      {deleteModalOpen && (
        <DeleteNoteModal
          open={deleteModalOpen}
          onClose={setDeleteModalOpen}
          selectedNote={selectedNote}
        />
      )}
    </ModalLayout>
  );
}

export default NoteOptionsModal;
