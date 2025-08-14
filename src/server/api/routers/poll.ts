import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { broadcastVote } from "../../broadcaster";
import { ee } from "../../utils/eventEmitter";

export const pollRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1),
        options: z.array(z.string().min(1)).min(2),
        endsAt: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.poll.create({
        data: {
          question: input.question,
          authorId: ctx.session!.user!.id,
          endsAt: input.endsAt ? new Date(input.endsAt) : null,
          options: {
            create: input.options.map((t, i) => ({ text: t, order: i })),
          },
        },
        include: { options: true },
      });
    }),

  getList: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.poll.findMany({
      include: {
        options: { include: { _count: { select: { votes: true } } } },
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  vote: protectedProcedure
    .input(
      z.object({
        pollId: z.string(),
        optionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.user!.id;
      const vote = await ctx.db.$transaction(async (tx) => {
        await tx.pollVote.deleteMany({
          where: { pollId: input.pollId, userId },
        });
        return tx.pollVote.create({
          data: {
            pollId: input.pollId,
            userId,
            optionId: input.optionId,
          },
        });
      });
      await broadcastVote({ pollId: input.pollId, optionId: input.optionId });
      return vote;
    }),

  onVote: publicProcedure
    .input(z.object({ pollId: z.string() }))
    .subscription(async function* ({ input }) {
      const queue: { optionId: string }[] = [];
      const handler = (p: { optionId: string }) => queue.push(p);
      ee.on(input.pollId, handler);
      try {
        while (true) {
          if (queue.length) yield queue.shift();
          else await new Promise((r) => setTimeout(r, 100));
        }
      } finally {
        ee.off(input.pollId, handler);
      }
    }),
});
