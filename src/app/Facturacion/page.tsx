"use client";
import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "../../components/button";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AgregarManualmente from "./agregarManualmente";
import { Input } from "~/components/ui/input";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Facturacion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [invoiceProducts, setInvoiceProducts] = useState<Product[]>([]);



  // Start scanning for barcodes
  const startScanning = () => {
    codeReader.current = new BrowserMultiFormatReader();
    codeReader.current.decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
      if (result) {
        const barcode = result.getText();
        handleAddScannedProduct(barcode);
      }
    });
    setIsScanning(true);
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
      
        setIsScanning(false);
      });
      
  };
  }
  const toggleScanning = () => {
    isScanning ? stopScanning() : startScanning();
  };

  const handleAddScannedProduct = (barcode: string) => {
    // Aquí puedes conectar la API para buscar productos por código de barras
    const product = productList.find((p) => p.id.toString() === barcode); // Simulación
    if (product) {
      setInvoiceProducts((prev) => [...prev, product]);
    } else {
      console.error("Producto no encontrado.");
    }
  };

  const handleAddManualProduct = (product: Product) => {
    setInvoiceProducts((prev) => [...prev, product]);
  };

  // API Mutations
const router =useRouter()
  const {mutateAsync: createInvoice} = api.invoice.create.useMutation({})
  const {mutateAsync: CreateProductList} = api.invoiceProducts.create.useMutation({})



  const handleCreateInvoice = async () => {
    const totalAmount = invoiceProducts.reduce((sum, p) => sum + p.price, 0);
    const invoice = await createInvoice({
      customerName: "John Doe",
      totalAmount: totalAmount.toFixed(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (const product of invoiceProducts) {
      await CreateProductList({
        invoiceId: invoice.id,
        productId: product.id,
        priceAtPurchase: product.price.toFixed(2),
        quantity: 1,
        totalPrice: product.price.toFixed(2),
      });
    }

    // Limpia la lista después de crear la factura
    setInvoiceProducts([]);
    toast.message("Factura creada:", invoice);
    router.push(`/facturas/${invoice.id}`);


  };

const [openAddManualProduct, setOpenAddManualProduct] = useState(false);
const [productosFactura, setProductosFactura] = useState([]);

const agregarProductos = (productos: any) => {
  setInvoiceProducts((prev) => [...prev, ...productos]);
};
  
const actualizarProducto = (id: number, key: string, value: number) => {
  setInvoiceProducts((prev) =>
    prev.map((product) =>
      product.id === id ? { ...product, [key]: value } : product
    )
  );
};

const eliminarProducto = (id: number) => {
  setInvoiceProducts((prev) => prev.filter((product) => product.id !== id));
};

return (
  <div className="flex flex-col h-screen p-4 space-y-4">
    {/* Botones superiores */}
    <div className="flex justify-between items-center">
      <div className="space-x-4">
        <Button onClick={toggleScanning}>
          {isScanning ? "Detener Escaneo" : "Iniciar Escaneo"}
        </Button>
        <Button onClick={() => setOpenAddManualProduct(true)}>
          Agregar Producto Manualmente
        </Button>
      </div>
    </div>

    {/* Recuadro de la cámara */}
    <div className="border border-gray-300 rounded-md p-4 flex justify-center items-center">
      <video
        ref={videoRef}
        style={{ width: "300px", maxWidth: "350px", height: "auto", backgroundColor: "black" }}
      />
    </div>
    <AgregarManualmente
      agregarProductos={agregarProductos}
      open={openAddManualProduct}
      setOpen={setOpenAddManualProduct}
    />
    {/* Lista de productos */}
    <div className="flex-grow overflow-auto border border-gray-300 rounded-md p-4">
      <h3 className="text-lg font-bold mb-4">Productos en la Factura</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">Producto</th>
            <th className="text-left py-2 px-4">Cantidad</th>
            <th className="text-left py-2 px-4">Precio</th>
            <th className="text-left py-2 px-4">Total</th>
            <th className="py-2 px-4">Acción</th>
          </tr>
        </thead>
        <tbody>
          {invoiceProducts.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">
                <Input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    actualizarProducto(product.id, "quantity", + e.target.value)
                  }
                />
              </td>
              <td className="py-2 px-4">
                <Input
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) =>
                    actualizarProducto(product.id, "price", +e.target.value)
                  }
                />
              </td>
              <td className="py-2 px-4">
                ${(product.quantity * product.price).toFixed(2)}
              </td>
              <td className="py-2 px-4">
                <Button
                  variant="destructive"
                  onClick={() => eliminarProducto(product.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Botón de confirmación */}
    <div className="flex justify-end">
      <Button onClick={handleCreateInvoice} className="w-40">
        Confirmar
      </Button>
    </div>

   
  </div>
);
}