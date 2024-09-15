import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { categories } from "~/server/db/schema";

export const categoriesRouter = createTRPCRouter({
  // Crear un nuevo invoiceo
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [newinvoice] = await ctx.db
        .insert(categories)
        .values({
          ...input,
          createdAt: input.createdAt ?? new Date(),
          updatedAt: input.updatedAt ?? new Date(),
        })
        .returning();

      if (!newinvoice) {
        throw new Error("Error al crear el invoiceo");
      }

      return newinvoice;
    }),

  // Listar todos los invoiceos
  list: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.query.categories.findMany();
    return categories;
  }),

  // Obtener un invoiceo por su ID
  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const invoice = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      return invoice;
    }),

  // Actualizar un invoiceo existente
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedinvoice = await ctx.db
        .update(categories)
        .set({
          ...input,
          updatedAt: input.updatedAt ?? new Date(),
        })
        .where(eq(categories.id, input.id))
        .returning();

      if (!updatedinvoice) {
        throw new Error("Error al actualizar el invoiceo");
      }

      return updatedinvoice;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
    }),
});
