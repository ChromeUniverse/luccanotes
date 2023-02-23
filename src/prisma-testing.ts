import { prisma } from "./server/db";
import { Prisma } from "@prisma/client";

const userId = "clehia9kk0000wg764sxumbfz";

const tags: Prisma.TagCreateManyArgs["data"] = [
  {
    label: "Coding",
    color: "RED",
    userId,
  },
  {
    label: "Music",
    color: "SKY",
    userId,
  },
  {
    label: "School",
    color: "YELLOW",
    userId,
  },
  {
    label: "General",
    color: "LIGHT_GRAY",
    userId,
  },
  {
    label: "Tasks",
    color: "VIOLET",
    userId,
  },
  {
    label: "Work",
    color: "GREEN",
    userId,
  },
];

const notes: Prisma.NoteCreateArgs["data"][] = [
  // {
  // }
];

// {
//   label: "Coding",
//   color: "RED",
//   userId,
// },

async function getUsers() {
  const users = await prisma.user.findMany();
  console.log(`Got ${users.length} users:`, users);
}

// async function deleteTags() {
//   const deletedTags = await prisma.tag.deleteMany();
//   console.log(`Deleted ${deletedTags.count} tags.`);
// }

async function seedTags() {
  const createdTags = await prisma.tag.createMany({ data: tags });
  // console.log(`Created tag:`, createdTag);
  console.log(`Created ${createdTags.count} tags`);
}

async function getTags() {
  const tags = await prisma.tag.findMany();
  console.log(`Got ${tags.length} tags:`, tags);
}

async function deleteTags() {
  const deletedTags = await prisma.tag.deleteMany();
  console.log(`Deleted ${deletedTags.count} tags.`);
}

async function seedNotes() {
  //
}

async function getNotes() {
  const notes = await prisma.note.findMany();
  console.log(`Got ${notes.length} notes:`, notes);
}

async function deleteNotes() {
  const deletedNotes = await prisma.note.deleteMany();
  console.log(`Deleted ${deletedNotes.count} Notes.`);
}

async function main() {
  // users
  // void (await getUsers());
  // tags
  // void (await seedTags());
  // void (await getTags());
  // void (await deleteTags());
  // notes
  // void (await seedNotes());
  // void (await getNotes());
}

void main();
