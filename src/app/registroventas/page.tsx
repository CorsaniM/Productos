"use client"
import { GoBackArrow } from "~/components/goback-button";
import LayoutContainer from "~/components/layout-container";
import { api } from "~/trpc/react";

export default function Ventas(){

    const { data: salesCount } = api.invoiceProducts.salesCount.useQuery();
    const { data: totalRevenue } = api.invoiceProducts.totalRevenue.useQuery();
    const { data: topProducts } = api.invoiceProducts.topProducts.useQuery();

  const {data: invoices} = api.invoice.get.useQuery({id: 1});

    return(
    <LayoutContainer>
        <GoBackArrow/>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="p-6 bg-green-400 shadow rounded">
    <h2 className="text-lg font-semibold">Cantidad de Ventas</h2>
    <p className="text-3xl mt-4">{salesCount ?? 0}</p>
  </div>
  <div className="p-6 bg-green-400 shadow rounded">
    <h2 className="text-lg font-semibold">Total Facturado</h2>
    <p className="text-3xl mt-4">${totalRevenue ?? "0"}</p>
  </div>
  <div className="p-6 bg-green-400 shadow rounded">
    <h2 className="text-lg font-semibold">Productos Más Vendidos</h2>
    <ul className="list-disc pl-6 mt-4">
      {topProducts?.map((product) => (
        <li key={product.productId}>
          {product.productName} - {product.totalQuantity} vendidos
        </li>
      ))}
    </ul>
  </div>
</div>

<div>
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
        {invoices &&
        <tbody>
            <tr key={invoices.id} className="border-b">
              <td className="py-2 px-4">{invoices.createdAt.getDate()}</td>
              <td className="py-2 px-4">
                <h1>{invoices.customerName}</h1>
              </td>
              <td className="py-2 px-4">
               <h1>Price</h1>
              </td>
              <td className="py-2 px-4">
                {invoices.totalAmount} {invoices.totalAmount}
              </td>
            
            </tr>
        </tbody>
        }
      </table>
</div>
    </LayoutContainer>
        )
}