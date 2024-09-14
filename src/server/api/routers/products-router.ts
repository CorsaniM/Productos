import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { categories, invoiceProducts, products } from "~/server/db/schema";

export const productsRouter = createTRPCRouter({
  // Crear un nuevo producto
  create: publicProcedure
    .input(
      z.object({
        barcode: z.string().max(50),
        name: z.string().max(255),
        description: z.string().max(500).optional(),
        categoriesId: z.number().default(1),
        price: z.number().positive(),
        stock: z.number().int().nonnegative(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [newProduct] = await ctx.db
        .insert(products)
        .values({
          ...input,
          createdAt: input.createdAt || new Date(),
          updatedAt: input.updatedAt || new Date(),
        })
        .returning();

      if (!newProduct) {
        throw new Error("Error al crear el producto");
      }

      return newProduct;
    }),

  // Listar todos los productos
  list: publicProcedure.query(async ({ ctx }) => {
    const allProducts = await ctx.db.query.products.findMany({
      with: {
        categories: true,
        invoiceProducts: {
          with: {
            invoice: true,
          },
        },
      },
    });
    return allProducts;
  }),

  // Obtener un producto por su ID
  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
        with: {
          categories: true,
          invoiceProducts: {
            with: {
              invoice: true,
            },
          },
        },
      });

      return product;
    }),

  // Actualizar un producto existente
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        barcode: z.string().max(50).optional(),
        name: z.string().max(255).optional(),
        description: z.string().max(500).optional(),
        categoriesId: z.number().default(1),
        price: z.number().positive().optional(),
        stock: z.number().int().nonnegative().optional(),
        updatedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedProduct = await ctx.db
        .update(products)
        .set({
          ...input,
          updatedAt: input.updatedAt || new Date(),
        })
        .where(eq(products.id, input.id))
        .returning();

      if (!updatedProduct) {
        throw new Error("Error al actualizar el producto");
      }

      return updatedProduct;
    }),

  // Eliminar un producto por su ID
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(products).where(eq(products.id, input.id));
    }),
});
