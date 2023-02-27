import { Dialog, Listbox } from "@headlessui/react";
import { Tag } from "@prisma/client";
import { useRouter } from "next/router";
import { Check } from "phosphor-react";
import { useState } from "react";
import { api } from "../../utils/api";
import Button from "../Button";
import CaretUpDownIcon from "../CaretUpDownIcon";
import ModalLayout from "../Layouts/Modal";
import TagPill from "../TagPill";

function CreateNoteModal({
  open,
  onClose,
  tags,
}: {
  open: boolean;
  onClose: (newOpen: boolean) => void;
  tags: Tag[];
}) {
  // modal state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteTags, setNoteTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const tagsAvailable = tags.filter((t) => !noteTags.includes(t));

  // next router
  const router = useRouter();

  // trpc
  const utils = api.useContext();
  const createNoteMutation = api.notes.create.useMutation();

  function addTag() {
    if (!selectedTag) return;
    setSelectedTag(null);
    setNoteTags((prevNoteTags) => [...prevNoteTags, selectedTag]);
  }

  function onClickCreateNote() {
    createNoteMutation.mutate(
      { tagIds: noteTags.map((t) => t.id), title: noteTitle },
      {
        onSuccess: (createdNote, variables, context) => {
          utils.notes.getAll.setData(undefined, (oldNotes) =>
            oldNotes ? [...oldNotes, createdNote] : [createdNote]
          );
          void utils.notes.getAll.invalidate();
          // onClose(false);
          void router.push(`/notes/${createdNote.id}`);
        },
      }
    );
  }

  return (
    <ModalLayout open={open} onClose={onClose}>
      {/* Title & Description */}
      <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white">
        New note
      </Dialog.Title>
      <Dialog.Description className="hidden">
        This dialog allows you to create a new note
      </Dialog.Description>

      {/* Title */}
      <h3 className="text-xl font-normal text-gray-600 dark:text-gray-400">
        Title
      </h3>
      <input
        type="text"
        className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700  placeholder:text-gray-400 dark:bg-gray-950 dark:text-gray-300 dark:placeholder:text-gray-500"
        placeholder="My awesome note"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
      />

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
              onClick={addTag}
              iconOnly
              size="regular"
              disabled={!selectedTag}
            />
          </div>
        </>
      )}

      {/* Tags */}
      <h3 className="text-xl font-normal text-gray-600 dark:text-gray-400">
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {noteTags.length !== 0 ? (
          noteTags.map((tag: Tag) => (
            <TagPill
              key={tag.id}
              label={tag.label}
              color={tag.color}
              deletable
              onClickDelete={() =>
                setNoteTags((prevTags) =>
                  prevTags.filter((t) => t.id !== tag.id)
                )
              }
            />
          ))
        ) : (
          <span className="text-gray-400">No tags - nothing to see here.</span>
        )}
      </div>

      <Button
        icon="note-pencil"
        intent="primary"
        label="Create note"
        tooltipPosition="bottom"
        tooltipAlignment="xCenter"
        onClick={onClickCreateNote}
        size="rectangle"
        disabled={!noteTitle}
      />
    </ModalLayout>
  );
}

export default CreateNoteModal;
