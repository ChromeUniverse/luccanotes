import { Dialog, Listbox } from "@headlessui/react";
import { Check } from "phosphor-react";
import { useState } from "react";
import { type Note } from "../..";
import Button from "../Button";
import CaretUpDownIcon from "../CaretUpDownIcon";
import ModalLayout from "../Layouts/Modal";
import TagPill, { type Tag } from "../TagPill";
import DeleteNoteModal from "./DeleteNote";

function NoteOptionsModal({
  open,
  onClose,
  selectedNote,
  setSelectedNoteId,
  tags,
  renameNote,
  deleteNote,
  addTagToNote,
  deleteTagFromNote,
}: {
  open: boolean;
  onClose: (newOpen: boolean) => void;
  selectedNote: null | Note;
  setSelectedNoteId: (newId: string | null) => void;
  tags: Tag[];
  // modifier functions
  renameNote: ({
    newNoteTitle,
    noteId,
  }: {
    newNoteTitle: string;
    noteId: string;
  }) => void;
  deleteNote: (noteId: string) => void;
  addTagToNote: ({ tagId, noteId }: { tagId: string; noteId: string }) => void;
  deleteTagFromNote: ({
    tagId,
    noteId,
  }: {
    tagId: string;
    noteId: string;
  }) => void;
}) {
  // modal state
  const [noteTitle, setNoteTitle] = useState(
    selectedNote ? selectedNote.title : ""
  );
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const tagsAvailable = tags.filter((t) => !selectedNote?.tags.includes(t));

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
          onClick={() =>
            renameNote({ newNoteTitle: noteTitle, noteId: selectedNote.id })
          }
          iconOnly
          size="regular"
          disabled={!noteTitle}
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
              onClickDelete={() =>
                deleteTagFromNote({ noteId: selectedNote.id, tagId: tag.id })
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
              <Listbox.Button className="flex w-56 items-center justify-between gap-4 whitespace-nowrap rounded-lg border-2 bg-gray-200 px-3 py-1.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100">
                {selectedTag ? (
                  selectedTag.label
                ) : (
                  <span className="text-gray-400">Select a tag to add</span>
                )}
                <CaretUpDownIcon />
              </Listbox.Button>

              {/* Options */}
              <Listbox.Options className="absolute right-0 bottom-full z-20 mb-2 w-full items-center rounded-lg bg-gray-200 py-2 drop-shadow-lg">
                {tagsAvailable.map((tag, index) => (
                  <Listbox.Option
                    key={index}
                    className="flex items-center whitespace-nowrap py-1 pl-2 pr-6 text-gray-900 ui-active:bg-blue-200 ui-active:text-blue-600"
                    value={tag}
                  >
                    <Check
                      weight="bold"
                      size={20}
                      className="ml-1 mr-2 text-blue-500 opacity-0 ui-selected:opacity-100 ui-active:text-blue-600"
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
              onClick={() => {
                setSelectedTag(null);
                addTagToNote({
                  noteId: selectedNote.id,
                  tagId: selectedTag?.id as string,
                });
              }}
              iconOnly
              size="regular"
              disabled={!selectedTag}
            />
          </div>
        </>
      )}

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
      {deleteModalOpen && (
        <DeleteNoteModal
          open={deleteModalOpen}
          onClose={setDeleteModalOpen}
          deleteNote={deleteNote}
          selectedNote={selectedNote}
          setSelectedNoteId={setSelectedNoteId}
        />
      )}
    </ModalLayout>
  );
}

export default NoteOptionsModal;
