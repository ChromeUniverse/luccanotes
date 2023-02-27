import { type Note, type Tag } from "@prisma/client";

export type NoteWithTags = Note & { tags: Tag[] };
