import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Color } from "@prisma/client";

export const tagsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "asc" },
    });
  }),
  create: protectedProcedure
    .input(z.object({ label: z.string(), color: z.nativeEnum(Color) }))
    .mutation(({ ctx, input }) => {
      console.log("Got mutation!", input);
      return ctx.prisma.tag.create({
        data: {
          label: input.label,
          color: input.color,
          userId: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tag.delete({ where: { id: input.id } });
    }),
});
