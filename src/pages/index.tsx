import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { type NextPage } from "next";

import Navbar from "../components/Navbar";
// import SearchBar, { type SortField } from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
// import { type TagColors } from "../components/TagPill";
import Button from "../components/Button";
// import { type Note } from "../index.d.ts";

import { useMemo, useState } from "react";
import TagPill, { Tag, TagColor, tagColorNames } from "../components/TagPill";
import { type Note } from "..";
import SearchBar, { type SortField } from "../components/SearchBar";
import Layout from "../components/Layout";
import { Dialog, Listbox } from "@headlessui/react";
import CaretUpDownIcon from "../components/CaretUpDownIcon";
import { Check } from "phosphor-react";
import { nanoid } from "nanoid";

type TagsKeys = "coding" | "music" | "school" | "general" | "tasks" | "work";

const tags: Record<TagsKeys, Tag> = {
  coding: {
    id: nanoid(),
    label: "Coding",
    color: "red",
  },
  music: {
    id: nanoid(),
    label: "Music",
    color: "sky",
  },
  school: {
    id: nanoid(),
    label: "School",
    color: "yellow",
  },
  general: {
    id: nanoid(),
    label: "General",
    color: "lightGray",
  },
  tasks: {
    id: nanoid(),
    label: "Tasks",
    color: "violet",
  },
  work: {
    id: nanoid(),
    label: "Work",
    color: "green",
  },
} as const;

const TagsList = Object.values(tags);

const defaultDate = new Date();

function subtractSeconds(date: Date, seconds: number) {
  const bufferDate = new Date(date.getTime());
  bufferDate.setSeconds(bufferDate.getSeconds() - seconds);
  return bufferDate;
}

const notesList: Note[] = [
  {
    id: nanoid(),
    title: "My First Note",
    lastUpdated: subtractSeconds(defaultDate, 20),
    createdAt: subtractSeconds(defaultDate, 30),
    tags: [
      tags.coding,
      tags.music,
      tags.work,
      tags.general,
      tags.work,
      tags.general,
    ],
  },
  {
    id: nanoid(),
    title: "Second Note",
    lastUpdated: subtractSeconds(defaultDate, 30),
    createdAt: subtractSeconds(defaultDate, 20),
    tags: [tags.work, tags.general, tags.work, tags.general],
  },
  {
    id: nanoid(),
    title: "Note Number 3",
    lastUpdated: defaultDate,
    createdAt: subtractSeconds(defaultDate, 10),
    tags: [tags.school, tags.tasks, tags.work, tags.general, tags.coding],
  },
  {
    id: nanoid(),
    title: "The 4th Note",
    lastUpdated: subtractSeconds(defaultDate, 10),
    createdAt: defaultDate,
    tags: [
      tags.coding,
      tags.tasks,
      tags.work,
      tags.general,
      tags.coding,
      tags.work,
      tags.general,
    ],
  },
];

function sortNotes(
  notes: Note[],
  sortField: SortField,
  sortOrder: "asc" | "desc"
): Note[] {
  switch (sortField) {
    case "title":
      return notes //
        .sort((n1, n2) => {
          if (n1.title < n2.title) return sortOrder === "asc" ? -1 : 1;
          if (n1.title > n2.title) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
    case "createdAt":
      return notes //
        .sort((n1, n2) => {
          return sortOrder === "asc"
            ? n1.createdAt.getTime() - n2.createdAt.getTime()
            : n2.createdAt.getTime() - n1.createdAt.getTime();
        });
    case "lastUpdated":
      return notes //
        .sort((n1, n2) => {
          return sortOrder === "asc"
            ? n1.lastUpdated.getTime() - n2.lastUpdated.getTime()
            : n2.lastUpdated.getTime() - n1.lastUpdated.getTime();
        });
    default:
      throw new Error("Tried to process notes, got to switch-case dead end");
  }
}

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  // data
  const [tags, setTags] = useState<Tag[]>(TagsList);
  const [notes, setNotes] = useState<Note[]>(notesList);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState<string>("");
  const [newTagColor, setNewTagColor] = useState<TagColor>("sky");

  // Search parameters state
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const visibleNotes = useMemo(() => {
    // sort notes
    const sortedNotes = sortNotes(notes, sortField, sortOrder);
    // match note title
    return sortedNotes.filter((note) =>
      note.title.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [searchInput, sortField, sortOrder, notes]);

  const searchBarProps = {
    tags: Object.values(tags),
    searchInput,
    setSearchInput,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  };

  function TagButtonClickHandler() {
    console.log("clicked");
    setModalOpen(true);
  }

  function createNewTag() {
    if (!newTagLabel) return;
    const newTag: Tag = {
      id: nanoid(),
      label: newTagLabel,
      color: newTagColor,
    };
    setNewTagLabel("");
    setTags((prevTags) => [...prevTags, newTag]);
  }

  function deleteTag(targetId: string) {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== targetId));
    setNotes((prevNotes) =>
      prevNotes.map((note) => ({
        ...note,
        tags: note.tags.filter((tag: Tag) => tag.id !== targetId),
      }))
    );
  }

  return (
    <Layout>
      {/* Top row */}
      <div className="flex gap-3">
        <SearchBar {...searchBarProps} />
        <div className="hidden gap-3 md:flex">
          <Button
            intent="secondary"
            icon="tag"
            label="Manage tags"
            tooltipPosition="bottom"
            tooltipAlignment="xCenter"
            size="lg"
            onClick={TagButtonClickHandler}
            iconOnly
          />
          <Button
            intent="primary"
            icon="note-pencil"
            label="New note"
            tooltipPosition="bottom"
            tooltipAlignment="xCenter"
            size="lg"
            iconOnly
          />
        </div>
      </div>
      {/* Note card container */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {visibleNotes.map(({ lastUpdated, title, tags }, index) => (
          <NoteCard
            key={index}
            title={title}
            lastUpdated={lastUpdated}
            tags={tags}
            flipTags={
              index === visibleNotes.length - 1 && visibleNotes.length >= 3
            }
          />
        ))}
      </div>
      {/* Mobile button container */}
      <div className="fixed right-0 bottom-0 flex flex-col gap-2 px-5 py-5 md:hidden">
        <Button //
          intent="secondary"
          icon="tag"
          label="Manage tags"
          roundedFull
          tooltipPosition="left"
          tooltipAlignment="yCenter"
          size="lg"
          shadow
          onClick={TagButtonClickHandler}
          iconOnly
        />
        <Button
          intent="primary"
          icon="note-pencil"
          label="New note"
          roundedFull
          tooltipPosition="left"
          tooltipAlignment="yCenter"
          size="lg"
          shadow
          iconOnly
        />
      </div>
      {/* Modals */}

      <Dialog open={modalOpen} onClose={setModalOpen}>
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-25">
          <Dialog.Panel className="w-[90%] space-y-6 rounded-lg bg-white px-6 py-6 md:w-[500px] md:px-10">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">
              Manage Tags
            </Dialog.Title>
            <Dialog.Description className="hidden">
              This dialog allows you to manage your tags
            </Dialog.Description>

            {/* <p>
              Are you sure you want to deactivate your account? All of your data
              will be permanently removed. This action cannot be undone.
            </p> */}

            {/* Tags containers */}
            <h3 className="text-xl font-normal text-gray-600">All tags</h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(tags).map((tag) => (
                <TagPill
                  key={tag.id}
                  label={tag.label}
                  color={tag.color}
                  deletable
                  onClickDelete={() => deleteTag(tag.id)}
                />
              ))}
            </div>

            {/* Create new tag */}
            <h3 className="text-xl font-normal text-gray-600">
              Create new tag
            </h3>

            <div className="flex flex-col gap-2 md:flex-row">
              {/* New tag label input */}
              <input
                className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 outline-gray-500 placeholder:text-gray-400"
                placeholder="New tag label here..."
                type="text"
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
              />

              {/* New tag color selector */}
              <div className="flex justify-between gap-2">
                <Listbox
                  as="div"
                  value={newTagColor}
                  onChange={setNewTagColor}
                  className="relative"
                >
                  {/* Button */}
                  <Listbox.Button className="flex w-36 items-center justify-between gap-4 whitespace-nowrap rounded-lg border-2 bg-gray-200 px-3 py-1.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100">
                    {tagColorNames[newTagColor]}
                    <CaretUpDownIcon />
                  </Listbox.Button>

                  {/* Options */}
                  <Listbox.Options className="absolute right-0 bottom-full z-20 mb-2 w-full items-center rounded-lg bg-gray-200 py-2 drop-shadow-lg">
                    {/* Light option */}
                    {Object.keys(tagColorNames).map((color, index) => (
                      <Listbox.Option
                        key={index}
                        className="flex items-center whitespace-nowrap py-1 pl-2 pr-6 text-gray-900 ui-active:bg-blue-200 ui-active:text-blue-600"
                        value={color}
                      >
                        <Check
                          weight="bold"
                          size={20}
                          className="ml-1 mr-2 text-blue-500 opacity-0 ui-selected:opacity-100 ui-active:text-blue-600"
                        />
                        {tagColorNames[color as TagColor]}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>

                <div className="hidden md:block">
                  <Button
                    icon="plus"
                    intent="primary"
                    label="Create tag"
                    tooltipPosition="bottom"
                    tooltipAlignment="xCenter"
                    onClick={() => createNewTag()}
                    iconOnly
                    size="regular"
                  />
                </div>

                <div className="block md:hidden">
                  <Button
                    icon="plus"
                    intent="primary"
                    label="Create tag"
                    tooltipPosition="bottom"
                    tooltipAlignment="xCenter"
                    onClick={() => createNewTag()}
                    size="rectangle"
                    reverse
                  />
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Layout>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
