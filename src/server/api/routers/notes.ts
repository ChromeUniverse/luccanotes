import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import DMP from "diff-match-patch";
import { TRPCError } from "@trpc/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { Session } from "next-auth";

const diffSchema = z.tuple([z.number(), z.string()]);
const patchesSchema: z.ZodType<(new () => DMP.patch_obj)[]> = z.any();

// get current note content, check ownership
async function getFullNote(
  prisma: PrismaClient,
  session: Session,
  noteId: string
) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: session.user.id },
    include: { tags: true },
  });
  if (!note) return null;
  return note;
}

export const notesRouter = createTRPCRouter({
  getSingle: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: {
          id: true,
          createdAt: true,
          lastUpdated: true,
          title: true,
          userId: true,
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  getSingleContent: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.note.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: { content: true, userId: true },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        createdAt: true,
        lastUpdated: true,
        title: true,
        userId: true,
        tags: { orderBy: { createdAt: "asc" } },
      },
    });
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string(), tagIds: z.string().cuid().array() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          tags: {
            connect: input.tagIds.map((tagId) => ({ id: tagId })),
          },
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          createdAt: true,
          lastUpdated: true,
          title: true,
          userId: true,
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!note) throw new TRPCError({ code: "NOT_FOUND" });

      return await ctx.prisma.note.delete({
        where: { id: input.id },
        select: {
          id: true,
          createdAt: true,
          lastUpdated: true,
          title: true,
          userId: true,
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  rename: protectedProcedure
    .input(z.object({ id: z.string().cuid(), newTitle: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!note) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.prisma.note.update({
        where: { id: input.id },
        data: { title: input.newTitle },
        select: {
          id: true,
          createdAt: true,
          lastUpdated: true,
          title: true,
          userId: true,
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  addTag: protectedProcedure
    .input(z.object({ id: z.string().cuid(), tagId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!note) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.prisma.note.update({
        where: { id: input.id },
        data: {
          tags: { connect: { id: input.tagId } },
        },
        select: {
          id: true,
          createdAt: true,
          lastUpdated: true,
          title: true,
          userId: true,
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  removeTag: protectedProcedure
    .input(z.object({ id: z.string().cuid(), tagId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!note) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.prisma.note.update({
        where: { id: input.id },
        data: {
          tags: { disconnect: { id: input.tagId } },
        },
        select: {
          id: true,
          createdAt: true,
          lastUpdated: true,
          title: true,
          userId: true,
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  updateContent: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        patches: patchesSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Got patches:", input.patches);

      const note = await getFullNote(ctx.prisma, ctx.session, input.id);
      if (!note) throw new TRPCError({ code: "NOT_FOUND" });

      // compute and apply text patches
      const dmp = new DMP.diff_match_patch();

      const [newContent, results] = dmp.patch_apply(
        input.patches,
        note.content
      );

      // update note with new text content
      const updatedNote = await ctx.prisma.note.update({
        where: { id: input.id },
        data: { content: newContent, lastUpdated: new Date() },
        include: { tags: true },
      });
      return;
    }),
});
