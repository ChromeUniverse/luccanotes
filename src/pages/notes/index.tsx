// t3 imports
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { type Session } from "next-auth";
import { api } from "../../utils/api";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { useMemo, useState } from "react";

// package imports
import { nanoid } from "nanoid";

// custom components
import PageLayout from "../../components/Layouts/Page";
import NoteCard from "../../components/NoteCard";
import Button from "../../components/Button";
import { type TagColor } from "../../components/TagPill";
import SearchBar, { type SortField } from "../../components/SearchBar";

import ManageTagsModal from "../../components/Modals/ManageTags";
import NoteOptionsModal from "../../components/Modals/NoteOptions";
import CreateNoteModal from "../../components/Modals/CreateNote";
import { getServerAuthSession } from "../../server/auth";
import { Note, Prisma, Tag } from "@prisma/client";
import { prisma } from "../../server/db";
import { NoteWithTags } from "../..";
import useSearchStore from "../../stores/search";

function sortNotes(
  notes: NoteWithTags[],
  sortField: SortField,
  sortOrder: "asc" | "desc"
) {
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

function NotesPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  // next auth
  const session = useSession().data as Session;

  // trpc
  const tagsQuery = api.tags.getAll.useQuery(undefined, {});
  const notesQuery = api.notes.getAll.useQuery();
  const notes = useMemo(() => {
    return notesQuery.data ?? [];
  }, [notesQuery.data]);
  const tags = tagsQuery.data ?? [];

  // modals state
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [createNoteModalOpen, setCreateNoteModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // zustand
  const { searchInput, sortField, sortOrder, selectedTagIds } =
    useSearchStore();

  // compute visible notes
  const visibleNotes = useMemo(() => {
    // sort notes
    const sortedNotes = sortNotes(notes, sortField, sortOrder);

    return (
      sortedNotes
        // match selected tags
        .filter((note) => {
          // pass all notes if there are no selected tags
          if (selectedTagIds.length === 0) return true;
          // check if `selectedTagIds` is a subset of `noteTagIds`
          const noteTagIds = note.tags.map((t) => t.id);
          for (const selectedTagId of selectedTagIds) {
            if (!noteTagIds.includes(selectedTagId)) return false;
          }
          return true;
        })
        // match note title
        .filter((note) =>
          note.title.toLowerCase().includes(searchInput.toLowerCase())
        )
    );
  }, [searchInput, sortField, sortOrder, notes, selectedTagIds]);

  if (!notes && !tags) return <span>Loading...</span>;

  return (
    <PageLayout container session={session}>
      {/* Top row */}
      <div className="flex gap-3">
        <SearchBar tags={tags} />
        <div className="hidden gap-3 md:flex">
          <Button
            intent="secondary"
            icon="tag"
            label="Manage tags"
            tooltipPosition="bottom"
            tooltipAlignment="xCenter"
            size="lg"
            onClick={() => setTagModalOpen(true)}
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
            onClick={() => setCreateNoteModalOpen(true)}
          />
        </div>
      </div>
      {/* Note card container */}
      {visibleNotes.length ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleNotes.map((note, index) => (
            <NoteCard
              key={note.id}
              note={note}
              flipTags={
                index === visibleNotes.length - 1 && visibleNotes.length >= 3
              }
              setSelectedNoteId={setSelectedNoteId}
              dateType={sortField === "createdAt" ? "createdAt" : "lastUpdated"}
              tags={tags}
            />
          ))}
        </div>
      ) : selectedTagIds.length === 0 && !searchInput ? (
        <p className="mt-20 text-center text-lg text-gray-400 dark:text-gray-600">
          No notes to see here.
          <br />
          Try clicking{" "}
          <span className="font-semibold text-blue-600">New note</span> to
          create one!
        </p>
      ) : (
        <p className="mt-20 text-center text-lg text-gray-400 dark:text-gray-600">
          No notes match these filters.
          <br />
          Try clicking{" "}
          <span className="font-semibold text-blue-600">New note</span> to
          create one!
        </p>
      )}
      {/* Mobile button container */}
      <div className="fixed right-0 bottom-0 flex flex-col gap-2 px-5 py-5 md:hidden">
        <Button //
          intent="secondaryAlt"
          icon="tag"
          label="Manage tags"
          roundedFull
          tooltipPosition="left"
          tooltipAlignment="yCenter"
          size="lg"
          shadow
          onClick={() => setTagModalOpen(true)}
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
          onClick={() => setCreateNoteModalOpen(true)}
        />
      </div>
      {/* Modals */}
      {tagModalOpen && (
        <ManageTagsModal
          open={tagModalOpen}
          onClose={setTagModalOpen}
          tags={tags}
        />
      )}
      {/* {false && (
        <NoteOptionsModal
          open={selectedNoteId !== null}
          onClose={() => setSelectedNoteId(null)}
          // setSelectedNoteId={setSelectedNoteId}
          // selectedNote={notes?.find((n) => n.id === selectedNoteId) ?? null}
          tags={tags}
        />
      )} */}
      {createNoteModalOpen && (
        <CreateNoteModal
          open={createNoteModalOpen}
          onClose={setCreateNoteModalOpen}
          tags={tags}
        />
      )}
    </PageLayout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return { props: { session } };
};

export default NotesPage;
