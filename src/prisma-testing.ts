import { prisma } from "./server/db";
import { Prisma } from "@prisma/client";

// local Postgres
const userId = "clef30pju0000wgem8fl2rm6u";

// supabase
// const userId = "clehia9kk0000wg764sxumbfz";

// railway
// const userId = "clekgk5pq0000wgnbm6xere11";

const tags: Prisma.TagCreateManyArgs["data"] = [
  {
    label: "Coding",
    color: "red",
    userId,
  },
  {
    label: "Music",
    color: "sky",
    userId,
  },
  {
    label: "School",
    color: "yellow",
    userId,
  },
  {
    label: "General",
    color: "lightGray",
    userId,
  },
  {
    label: "Tasks",
    color: "violet",
    userId,
  },
  {
    label: "Work",
    color: "green",
    userId,
  },
  {
    label: "Reading",
    color: "darkGray",
    userId,
  },
];

// const notesList: Note[] = [
//   {
//     id: nanoid(),
//     title: "My First Note",
//     lastUpdated: subtractSeconds(defaultDate, 20),
//     createdAt: subtractSeconds(defaultDate, 30),
//     tags: [tags.coding, tags.music, tags.work, tags.general],
//   },
//   {
//     id: nanoid(),
//     title: "Second Note",
//     lastUpdated: subtractSeconds(defaultDate, 30),
//     createdAt: subtractSeconds(defaultDate, 20),
//     tags: [tags.work, tags.general, tags.coding, tags.music],
//   },
//   {
//     id: nanoid(),
//     title: "Note Number 3",
//     lastUpdated: defaultDate,
//     createdAt: subtractSeconds(defaultDate, 10),
//     tags: [tags.school, tags.tasks, tags.work, tags.general, tags.coding],
//   },
//   {
//     id: nanoid(),
//     title: "The 4th Note",
//     lastUpdated: subtractSeconds(defaultDate, 10),
//     createdAt: defaultDate,
//     tags: [
//       tags.coding,
//       tags.tasks,
//       tags.work,
//       tags.general,
//       tags.music,
//       tags.school,
//     ],
//   },
// ];

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
  void (await seedTags());
  void (await getTags());
  // void (await deleteTags());
  // notes
  // void (await seedNotes());
  // void (await getNotes());
}

void main();
