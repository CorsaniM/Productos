import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { productsRouter } from "./routers/products-router";
import { invoicesRouter } from "./routers/invoice";
import { invoiceProductsRouter } from "./routers/invoiceToProducts";
import { clerkRouter } from "./routers/clerk-router";
import { categories } from "../db/schema";
import { categoriesRouter } from "./routers/categories";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  invoice: invoicesRouter,
  invoiceProducts: invoiceProductsRouter,
  clerk: clerkRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
