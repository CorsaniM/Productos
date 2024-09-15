import { integer } from "drizzle-orm/pg-core";
import { NextApiRequest, NextApiResponse } from "next";
import { fetchProductData } from "~/lib/utils";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { product } = req.body;

  if (!product) {
    return res.status(400).json({ error: "Producto no proporcionado" });
  }

  try {
    await db.insert(products).values({
      barcode: product.barcode ?? "",
      name: product.name ?? "",
      description: product.description ?? "",
      price: (product.price || 0) ?? 0,
      stock: (product.stock || 0) ?? 0,
      categoriesId: 1,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al insertar el producto" });
  }
}
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { barcode } = req.query;

//   if (!barcode) {
//     return res.status(400).json({ error: "Código de barras no proporcionado" });
//   }

//   try {
//     const product = await fetchProductData(barcode as string);
//     if (!product) {
//       return res.status(404).json({ error: "Producto no encontrado" });
//     }

//     res.status(200).json({ product });
//   } catch (error) {
//     res.status(500).json({ error: "Error al buscar el producto" });
//   }
// }
