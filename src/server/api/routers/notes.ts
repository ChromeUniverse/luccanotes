import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notesRouter = createTRPCRouter({
  getSingle: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findUnique({
        where: { id: input.id },
        include: {
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
      if (!note) return null;
      if (note.userId !== ctx.session.user.id) return null;
      return note;
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: { userId: ctx.session.user.id },
      include: {
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
        include: {
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.delete({
        where: { id: input.id },
        include: {
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  rename: protectedProcedure
    .input(z.object({ id: z.string().cuid(), newTitle: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.update({
        where: { id: input.id },
        data: { title: input.newTitle },
        include: {
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  addTag: protectedProcedure
    .input(z.object({ id: z.string().cuid(), tagId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.update({
        where: { id: input.id },
        data: {
          tags: { connect: { id: input.tagId } },
        },
        include: {
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),

  removeTag: protectedProcedure
    .input(z.object({ id: z.string().cuid(), tagId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      console.log("Got remove tag request");

      return ctx.prisma.note.update({
        where: { id: input.id },
        data: {
          tags: { disconnect: { id: input.tagId } },
        },
        include: {
          tags: { orderBy: { createdAt: "asc" } },
        },
      });
    }),
});
