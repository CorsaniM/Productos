"use client"
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Button } from '../../components/button';
import { redirect } from "next/navigation";
import router from 'next/router';
import Link from 'next/link';
import AgregarManualmente from './agregarManualmente';

interface ScannedItem {
  id: number;
  name: string;
  image: string;
  price: string;
}

export default function BarcodeScanner () {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReader = useRef<BrowserMultiFormatReader | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
    const [buttonColor, setButtonColor] = useState<string>('red');
    const [scanningTimeout, setScanningTimeout] = useState<NodeJS.Timeout | null>(null);
    const [scanAllowed, setScanAllowed] = useState(true);
    const [itemId, setItemId] = useState<number>(1);
  

  const [open, setOpen] = useState(false);
  const [productosEnLista, setProductosEnLista] = useState<any[]>([]);
  const agregarProductos = (productos: any[]) => {
    setScannedItems((prev) => [...prev, ...productos]);
  };

    useEffect(() => {
      codeReader.current = new BrowserMultiFormatReader();
  
      return () => {
        // Limpiamos recursos cuando el componente se desmonta
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
          if (data.status === 1) { // Verifica si el producto está en la base de datos
            return {
              id: itemId,
              name: data.product.product_name ?? 'Nombre no disponible',
              image: data.product.image_url ?? 'Imagen no disponible',
              price: 'Precio no disponible', // Open Food Facts no proporciona precios
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
        setScanAllowed(false); // Desactivar escaneo hasta que pase el tiempo de espera
        codeReader.current?.decodeFromVideoDevice(undefined, videoRef.current, async (result, err) => {
          if (result) {
            const code = result.getText();
            console.log("Código detectado:", code);
  
            const productInfo = await fetchProductInfo(code);
            if (productInfo) {
              setScannedItems((prev) => [...prev, productInfo]);
              setItemId((prev) => prev + 1); // Incrementar el ID para el siguiente producto
              setButtonColor('green'); // Cambia el color del botón a verde
  
              // Espera 3 segundos antes de permitir el siguiente escaneo
              if (scanningTimeout) clearTimeout(scanningTimeout);
              const timeout = setTimeout(() => {
                setButtonColor('red'); // Vuelve el color del botón a rojo
                setScanAllowed(true); // Permitir nuevo escaneo
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
        if (scanningTimeout) clearTimeout(scanningTimeout); // Limpiar el temporizador si se detiene el escaneo
        setScanAllowed(true); // Permitir escaneo si se detiene
      }
    };
  
    const toggleScanning = () => {
      if (isScanning) {
        stopScanning();
      } else {
        startScanning();
      }
    };

  

  return (
      <div>
        <Button className="ml-3 mt-5"><Link href="/">Volver atras</Link></Button>

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
        <div>
        <AgregarManualmente
        open={open}
        setOpen={setOpen}
        agregarProductos={agregarProductos} // Pasamos la función de agregar productos
      />
        <h3>Códigos de Barras Escaneados:</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {scannedItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td><img src={item.image} alt={item.name} style={{ width: '100px' }} /></td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>

  );
};
