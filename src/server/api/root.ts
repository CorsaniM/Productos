import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { productsRouter } from "./routers/products-router";
import { invoicesRouter } from "./routers/invoice";
import { invoiceProductsRouter } from "./routers/invoiceToProducts";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  invoice: invoicesRouter,
  invoiceProducts: invoiceProductsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
