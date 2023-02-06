import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { type NextPage } from "next";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import { TagColors } from "../components/TagPill";
import Button from "../components/Button";
import { NotePencil } from "phosphor-react";
import { Note, Tag } from "..";

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

const notes: Note[] = [
  {
    noteTitle: "My First Note",
    lastUpdated: "5 min",
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
    noteTitle: "Second Note",
    lastUpdated: "5 min",
    tags: [tags.work, tags.general, tags.work, tags.general],
  },
  {
    noteTitle: "Note Number 3",
    lastUpdated: "5 min",
    tags: [tags.school, tags.tasks, tags.work, tags.general, tags.coding],
  },
  {
    noteTitle: "The 4th Note",
    lastUpdated: "5 min",
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

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar username="lucca.dr" noteTitle="My First Note" />
      <main className=" flex-grow bg-gray-200 pt-4 pb-20">
        <div className="mx-auto px-4 md:w-[90%] md:max-w-[1200px]">
          {/* Top row */}
          <div className="flex gap-3">
            <SearchBar tags={Object.values(tags)} />
            <div className="hidden gap-3 md:flex">
              <Button
                intent="secondary"
                icon="tag"
                label="Manage tags"
                tooltipPosition="bottom"
                size="lg"
              />
              <Button
                intent="primary"
                icon="note-pencil"
                label="New note"
                tooltipPosition="bottom"
                size="lg"
              />
            </div>
          </div>
          {/* Note card container */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {notes.map(({ lastUpdated, noteTitle, tags }, index) => (
              <NoteCard
                key={index}
                noteTitle={noteTitle}
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
          size="lg"
          shadow
        />
        <Button
          intent="primary"
          icon="note-pencil"
          label="New note"
          roundedFull
          tooltipPosition="left"
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
