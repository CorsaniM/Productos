"use client"
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Button } from '../../../components/button';
import { toast } from "sonner"; 
import { api } from "~/trpc/react"; 
import { Input } from '~/components/ui/input';
import LayoutContainer from '~/components/layout-container';
import { GoBackArrow } from '~/components/goback-button';

interface ProductInfo {
  barcode: string;
  name: string;
  image: string;
  price: string;
}

export default function AgregarProductoPorCodigoDeBarras() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [buttonColor, setButtonColor] = useState<string>('red');
  
  
  const [stock, setStock] = useState("0");
const [price, setPrice] = useState("0");
const [name, setName] = useState("");
const [barcode, setBarcode] = useState("");

  const [scanningTimeout, setScanningTimeout] = useState<NodeJS.Timeout | null>(null);
  const [scanAllowed, setScanAllowed] = useState(true);

  // Mutación TRPC para crear productos
  const { mutateAsync: createProduct } = api.products.create.useMutation();

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const fetchProductInfo = async (barcode: string) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      if (!response.ok) {
        throw new Error('Error al obtener información del producto');
      }
      const data = await response.json();
      if (data.status === 1) {
        return {
          barcode,
          name: data.product.product_name || 'Nombre no disponible',
          image: data.product.image_url || 'Imagen no disponible',
          price: "0", // Asignamos un precio inicial manual
        };
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error en la solicitud a la API:', error);
      return null;
    }
  };

  const startScanning = () => {
    if (videoRef.current && scanAllowed) {
      setScanAllowed(false);
      codeReader.current?.decodeFromVideoDevice(undefined, videoRef.current, async (result, err) => {
        if (result) {
          const code = result.getText();
          console.log("Código detectado:", code);

          const productData = await fetchProductInfo(code);
          if (productData) {
            setProductInfo(productData);
            setButtonColor('green');
            setPrice(productData.price ?? 0);
            setBarcode(productData.barcode ?? "");
            setName(productData.name ?? "");
            // Espera 3 segundos antes de permitir el siguiente escaneo
            if (scanningTimeout) clearTimeout(scanningTimeout);
            const timeout = setTimeout(() => {
              setButtonColor('red');
              setScanAllowed(true);
            }, 3000);
            setScanningTimeout(timeout);
          }
        }
        if (err) {
          console.error("Error al escanear:", err);
        }
      });
      setIsScanning(true);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsScanning(false);
      if (scanningTimeout) clearTimeout(scanningTimeout);
      setScanAllowed(true);
    }
  };

  const toggleScanning = () => {
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  const handleAddProduct = async () => {

    if(price === "0" || stock === "0" || name === "" || barcode === "") {
      
      return toast.error("Por favor, complete todos los campos");

    }
    if (productInfo) {
      await createProduct({
        barcode: barcode,
        name: name,
        price: Number(price), 
        stock: Number(stock), 
      });
      toast.success("Producto agregado a la base de datos");
      setProductInfo(null); 
    }
  };

  return (
    <LayoutContainer>
            <GoBackArrow />

      <h2>Agregar Producto por Código de Barras</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, marginRight: '20px', marginLeft: "20px" }}>
          <br />
          <video ref={videoRef} style={{ width: '40%', height: 'auto', border: '2px solid black' }} />
          <button 
            onClick={toggleScanning} 
            style={{ 
              marginTop: '10px', 
              backgroundColor: buttonColor, 
              color: 'white', 
              border: 'none', 
              padding: '10px', 
              cursor: 'pointer' 
            }}
          >
            {isScanning ? 'Apagar Cámara' : 'Encender Cámara'}
          </button>
        </div>
        <div style={{ flex: 1 }}>
          {productInfo ? (
            <>
              <h3>Producto Escaneado</h3>
              <p><strong>Nombre:</strong></p>
              <Input
                      id="name"
                      value={name}
                      placeholder="ej... coca cola 600ml"
                      type="name"
                      onChange={(e) => setName(e.target.value)}
                    />
              <p><strong>Código de Barras:</strong></p>
              <Input
                      id="barcode"
                      value={barcode}
                      placeholder="ej... 804515874415"
                      type="barcode"
                      onChange={(e) => setBarcode(e.target.value)}
                    />
              <p><strong>Precio: $</strong></p>
              <Input
                      id="price"
                      value={price}
                      placeholder="ej...0"
                      type="price"
                      onChange={(e) => setPrice(e.target.value)}
                    />
              <p><strong>Cantidad:</strong></p>

              <Input
                      id="stock"
                      value={stock}
                      placeholder="0"
                      type="number"
                      onChange={(e) => setStock(e.target.value)}
                    />
              <img src={productInfo.image} alt={productInfo.name} style={{ width: '100px' }} />
              <Button onClick={handleAddProduct} style={{ marginTop: '10px', padding: '10px', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}>
                Agregar a la Base de Datos
              </Button>
            </>
          ) : (
            <p>No se ha escaneado ningún producto</p>
          )}
        </div>
      </div>
    </LayoutContainer>
  );
}
