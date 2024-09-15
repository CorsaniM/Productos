"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react"; // Suponiendo que estás usando TRPC

const ProductPage = () => {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar producto en la API externa
  const handleSearchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/search?barcode=${barcode}`);
      const data = await response.json();

      if (data.product) {
        setProduct(data.product);
      } else {
        setError("Producto no encontrado.");
      }
    } catch (err) {
      setError("Error en la búsqueda del producto.");
    } finally {
      setLoading(false);
    }
  };

  const handleInsertProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Producto insertado exitosamente en la base de datos.");
      } else {
        setError("Error al insertar el producto en la base de datos.");
      }
    } catch (err) {
      setError("Error al insertar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Buscar e Insertar Producto</h1>

      <div>
        <label htmlFor="barcode">Código de Barras:</label>
        <input
          type="text"
          id="barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Ingresa el código de barras"
        />
      </div>

      <div>
        <button onClick={handleSearchProduct} disabled={loading}>
          {loading ? "Buscando..." : "Buscar Producto"}
        </button>
        {product && (
          <div>
            <h2>Producto Encontrado:</h2>
            <p><strong>Nombre:</strong> {product.name}</p>
            <p><strong>Descripción:</strong> {product.description}</p>
            <p><strong>Código de Barras:</strong> {product.barcode}</p>
            <button onClick={handleInsertProduct} disabled={loading}>
              {loading ? "Insertando..." : "Insertar en Base de Datos"}
            </button>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ProductPage;
