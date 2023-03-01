import { type Note, type Tag } from "@prisma/client";

export type NoteWithTags = Omit<Note, "content"> & { tags: Tag[] };
