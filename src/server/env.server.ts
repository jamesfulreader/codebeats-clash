import { config as load } from "dotenv-flow";
load({ silent: true });

import { z } from "zod";

const schema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(3001),
    WS_PATH: z.string().default("/socket"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    NEXTAUTH_SECRET: z.string().optional(),
    AUTH_SECRET: z.string().optional(),
  })
  .transform((v) => ({
    ...v,
    authSecret: v.NEXTAUTH_SECRET ?? v.AUTH_SECRET,
  }));

export const env = schema.parse(process.env);
