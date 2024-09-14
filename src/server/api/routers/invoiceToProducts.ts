import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { invoiceProducts } from "~/server/db/schema";

export const invoiceProductsRouter = createTRPCRouter({
  // Crear un nuevo invoiceo
  create: publicProcedure
    .input(
      z.object({
        invoiceId: z.number(),
        productId: z.number(),
        quantity: z.number(),
        priceAtPurchase: z.string(),
        totalPrice: z.string(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [newinvoice] = await ctx.db
        .insert(invoiceProducts)
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
    const allinvoiceProducts = await ctx.db.query.invoiceProducts.findMany({
      with: { products: true },
    });
    return allinvoiceProducts;
  }),

  // Obtener un invoiceo por su ID
  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const invoice = await ctx.db.query.invoiceProducts.findFirst({
        where: eq(invoiceProducts.id, input.id),
        with: { products: true },
      });

      return invoice;
    }),
  getbyproduct: publicProcedure
    .input(
      z.object({
        productId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const invoice = await ctx.db.query.invoiceProducts.findMany({
        where: eq(invoiceProducts.productId, input.productId),
      });

      return invoice.length;
    }),
  // Actualizar un invoiceo existente
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        invoiceId: z.number(),
        productId: z.number(),
        quantity: z.number(),
        priceAtPurchase: z.string(),
        totalPrice: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedinvoice = await ctx.db
        .update(invoiceProducts)
        .set({
          ...input,
        })
        .where(eq(invoiceProducts.id, input.id))
        .returning();

      if (!updatedinvoice) {
        throw new Error("Error al actualizar el invoiceo");
      }

      return updatedinvoice;
    }),

  // Eliminar un invoiceo por su ID
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(invoiceProducts)
        .where(eq(invoiceProducts.id, input.id));
    }),
});
