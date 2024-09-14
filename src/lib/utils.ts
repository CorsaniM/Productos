import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
