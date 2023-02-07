import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { type NextPage } from "next";

import Navbar from "../components/Navbar";
import SearchBar, { SortField } from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import Button from "../components/Button";
import { Note, Tag } from "..";
import { useMemo, useState } from "react";

type TagsKeys = "coding" | "music" | "school" | "general" | "tasks" | "work";

const tags: { [key in TagsKeys]: Tag } = {
  coding: {
    label: "Coding",
    color: "red",
  },
  music: {
    label: "Music",
    color: "sky",
  },
  school: {
    label: "School",
    color: "yellow",
  },
  general: {
    label: "General",
    color: "lightGray",
  },
  tasks: {
    label: "Tasks",
    color: "violet",
  },
  work: {
    label: "Work",
    color: "green",
  },
} as const;

const defaultDate = new Date();

function subtractSeconds(date: Date, seconds: number) {
  const bufferDate = new Date(date.getTime());
  bufferDate.setSeconds(bufferDate.getSeconds() - seconds);
  return bufferDate;
}

const notes: Note[] = [
  {
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
    title: "Second Note",
    lastUpdated: subtractSeconds(defaultDate, 30),
    createdAt: subtractSeconds(defaultDate, 20),
    tags: [tags.work, tags.general, tags.work, tags.general],
  },
  {
    title: "Note Number 3",
    lastUpdated: defaultDate,
    createdAt: subtractSeconds(defaultDate, 10),
    tags: [tags.school, tags.tasks, tags.work, tags.general, tags.coding],
  },
  {
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
  }, [searchInput, sortField, sortOrder]);

  const searchBarProps = {
    tags: Object.values(tags),
    searchInput,
    setSearchInput,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar username="lucca.dr" noteTitle="My First Note" />
      <main className=" flex-grow bg-gray-200 pt-4 pb-20">
        <div className="mx-auto px-4 md:w-[90%] md:max-w-[1200px]">
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
              />
              <Button
                intent="primary"
                icon="note-pencil"
                label="New note"
                tooltipPosition="bottom"
                tooltipAlignment="xCenter"
                size="lg"
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
              />
            ))}
          </div>
        </div>
      </main>
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
        />
      </div>
    </div>
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
