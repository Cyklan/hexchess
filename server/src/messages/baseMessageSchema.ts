import { z } from "zod";

export const subjectEnum = z.enum(["join_random", "join_game", "game_update"]);

export const joinRandomSchema = z.object({
  subject: z.literal(subjectEnum.enum.join_random),
  userId: z.string(),
  userName: z.string(),
});

export type JoinRandomMessage = z.infer<typeof joinRandomSchema>;

export const joinSpecificGameSchema = z.object({
  subject: z.literal(subjectEnum.enum.join_game),
  password: z.string(),
  userId: z.string(),
  userName: z.string(),
});

export type JoinSpecificGameMessage = z.infer<typeof joinSpecificGameSchema>;

export const coordinateSchema = z.object({
  q: z.number(),
  r: z.number(),
});

export const moveSchema = z.object({
  move: z.number(),
  piece: z.number().min(0).max(5),
  from: coordinateSchema,
  to: coordinateSchema,
});

export type Move = z.infer<typeof moveSchema>;

export const gameUpdateSchema = z.object({
  subject: z.literal(subjectEnum.enum.game_update),
  userId: z.string(),
  move: moveSchema,
});

export type GameUpdateMessage = z.infer<typeof gameUpdateSchema>;

export const baseMessageSchema = z.discriminatedUnion("subject", [
  joinRandomSchema,
  joinSpecificGameSchema,
  gameUpdateSchema,
]);
