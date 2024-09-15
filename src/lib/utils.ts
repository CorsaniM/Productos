import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchProductData(barcode: string) {
  const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.product) {
      return null; // Si el producto no se encuentra
    }

    const product = {
      barcode: data.code,
      name: data.product.product_name,
      description: data.product.generic_name || "No description available",
      price: data.product.nutriments["price"] || 0, // Usamos un valor dummy ya que Open Food Facts no tiene precios
      stock: 10, // Valor de stock dummy
    };

    return product;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}
export async function insertProduct(productData: {
  barcode: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}) {
  try {
    // Inserta el producto en la base de datos
    await db.insert(products).values({
      barcode: productData.barcode,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      categoriesId: 1,
      // createdAt y updatedAt son gestionados automáticamente si tu esquema lo tiene configurado
    });

    return { success: true };
  } catch (error) {
    console.error("Error inserting product:", error);
    return { success: false, error: "Failed to insert product." };
  }
}
