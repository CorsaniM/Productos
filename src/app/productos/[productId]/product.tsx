"use client"
import { GoBackArrow } from "~/components/goback-button";
import LayoutContainer from "~/components/layout-container";
import { api } from "~/trpc/react";

export default function ProductPage(props: { params: { productId: string } }) {

    const productId = parseInt(props.params.productId)
const {data: producto} = api.products.get.useQuery({id: productId})

const { data: cantidadVendida } = api.invoiceProducts.getbyproduct.useQuery({ productId });

if(!producto){
    <h1>Este producto? no existe o esta registrado</h1>
}

     return (
        <LayoutContainer>
            <GoBackArrow />
        <div style={{ padding: "20px" }}>
          <h1>Detalles del producto</h1>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Campo</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>Código de Barras</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{producto?.barcode ?? "Sin Código"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>Nombre</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{producto?.name?? "Sin nombre asignado" }</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>Descripción</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{producto?.description?? "Sin descripcion asignada"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>Precio</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>${producto?.price?? "Sin precio asignado"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>Stock</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{producto?.stock?? "Sin  stock asignado"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>Cantidad Vendida</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{cantidadVendida ?? "Sin ventas contadas"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </LayoutContainer>

      );
}