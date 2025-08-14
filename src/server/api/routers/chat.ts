import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { broadcastMessage } from "../../broadcaster";
import { ee } from "../../utils/eventEmitter";

export const chatRouter = createTRPCRouter({
  postMessage: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        pollId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const msg = await ctx.db.message.create({
        data: {
          text: input.text,
          authorId: ctx.session!.user!.id,
          pollId: input.pollId ?? null,
        },
      });
      await broadcastMessage({
        messageId: msg.id,
        text: input.text,
        authorId: ctx.session!.user!.id,
        pollId: input.pollId ?? null,
      });
      return msg;
    }),

  getRecent: protectedProcedure
    .input(
      z.object({
        pollId: z.string().nullable().optional(),
        limit: z.number().min(1).max(200).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.pollId ? { pollId: input.pollId } : { pollId: null };
      const msgs = await ctx.db.message.findMany({
        where,
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });
      return msgs.reverse();
    }),

  onMessage: protectedProcedure
    .input(z.object({ pollId: z.string().nullable().optional() }))
    .subscription(async function* ({ input }) {
      const channel = input.pollId ?? "global";
      const queue: any[] = [];
      const handler = (p: any) => queue.push(p);
      ee.on(channel, handler);
      try {
        while (true) {
          if (queue.length) yield queue.shift()!;
          else await new Promise((r) => setTimeout(r, 100));
        }
      } finally {
        ee.off(channel, handler);
      }
    }),
});
