// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `products_${name}`);

export const products = createTable("products", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  barcode: text("barcode", { length: 50 }).notNull(),
  name: text("name", { length: 255 }).notNull(),
  description: text("description", { length: 500 }).default(""),
  categoriesId: int("categoriesId")
    .references(() => categories.id)
    .notNull(),
  price: int("price").notNull(),
  stock: int("stock").default(0).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updatedAt", { mode: "timestamp" }),
});

export const categories = createTable("categories", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }).notNull(),
  description: text("description", { length: 500 }).default(""),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updatedAt", { mode: "timestamp" }),
});

export const productsRelations = relations(products, ({ many, one }) => ({
  category: one(categories, {
    fields: [products.categoriesId],
    references: [categories.id],
  }),
  invoiceProducts: many(invoiceProducts),
}));

export const invoices = createTable("invoices", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  totalAmount: text("total_amount").notNull(),
  customerName: text("customer_name", { length: 255 }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }),
});

export const invoiceProducts = createTable("invoice_products", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  invoiceId: int("invoice_id")
    .references(() => invoices.id)
    .notNull(),
  productId: int("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: int("quantity").default(1).notNull(),
  priceAtPurchase: text("price_at_purchase").notNull(),
  totalPrice: text("totalPrice").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }),
});
export const invoiceRelations = relations(invoices, ({ many }) => ({
  invoiceProducts: many(invoiceProducts),
}));

export const invoiceProductsRelations = relations(
  invoiceProducts,
  ({ one }) => ({
    product: one(products, {
      fields: [invoiceProducts.productId],
      references: [products.id],
    }),
    invoice: one(invoices, {
      fields: [invoiceProducts.invoiceId],
      references: [invoices.id],
    }),
  }),
);
