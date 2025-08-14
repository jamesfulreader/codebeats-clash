// src/server/broadcaster.ts
import { ee } from "./utils/eventEmitter";

export type VoteEvent = { pollId: string; optionId: string };
export type MessageEvent = {
  pollId?: string | null;
  messageId: string;
  text: string;
  authorId: string;
};

export async function broadcastVote(e: VoteEvent) {
  ee.emit(e.pollId, { optionId: e.optionId });
}

export async function broadcastMessage(e: MessageEvent) {
  const channel = e.pollId ?? "global";
  ee.emit(channel, {
    messageId: e.messageId,
    text: e.text,
    authorId: e.authorId,
  });
}
