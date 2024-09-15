import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { invoices } from "~/server/db/schema";

export const invoicesRouter = createTRPCRouter({
  // Crear un nuevo invoiceo
  create: publicProcedure
    .input(
      z.object({
        totalAmount: z.string(),
        customerName: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [newinvoice] = await ctx.db
        .insert(invoices)
        .values({
          ...input,
          createdAt: input.createdAt || new Date(),
          updatedAt: input.updatedAt || new Date(),
        })
        .returning();

      if (!newinvoice) {
        throw new Error("Error al crear el invoiceo");
      }

      return newinvoice;
    }),

  // Listar todos los invoiceos
  list: publicProcedure.query(async ({ ctx }) => {
    const allinvoices = await ctx.db.query.invoices.findMany({
      with: { invoiceProducts: { with: { product: true } } },
    });
    return allinvoices;
  }),

  // Obtener un invoiceo por su ID
  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const invoice = await ctx.db.query.invoices.findFirst({
        where: eq(invoices.id, input.id),
        with: { invoiceProducts: { with: { product: true } } },
      });

      return invoice;
    }),

  // Actualizar un invoiceo existente
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        totalAmount: z.string(),
        customerName: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedinvoice = await ctx.db
        .update(invoices)
        .set({
          ...input,
          updatedAt: input.updatedAt || new Date(),
        })
        .where(eq(invoices.id, input.id))
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
      await ctx.db.delete(invoices).where(eq(invoices.id, input.id));
    }),
});
