"use client"
import { Button } from "~/components/button";
import { List, ListTile } from "~/components/ui/list";
import { Title } from "~/components/ui/title";
import { api } from "~/trpc/react";
import CrearProducto from "./CrearProducto";

export default function AsignarPrecios(){

    const {data: precios} = api.products.list.useQuery()


    async function handleCreate() {



    }
    return(
        <div>
          <Title>Preductos</Title>
          
             <CrearProducto/>
             <List>
          {precios ? precios.map((precio) => {
            return (
              <ListTile
                key={precio.id}
                href={`/asignarprecios/${precio.id}`}
                title={precio.name}
              />
            );
          }) : (<h1>No existen precios asociados</h1>)}
        </List>
        </div>
    )

}