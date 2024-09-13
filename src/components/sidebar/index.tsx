"use client"
import {
    
  DollarSign,
    Mails,
    NotebookIcon,
    Rows3,
    ShoppingBag,
    Users,
  } from "lucide-react";
import Sidenav, { SidenavItem } from "../sidenav";



export default function Page() {

    
   
        return (
            <Sidenav>
            <SidenavItem icon={<DollarSign />} href="/productos">
              Productos
            </SidenavItem>
            <SidenavItem icon={<ShoppingBag />} href="/facturacion">
              Facturacion
            </SidenavItem>
            <SidenavItem icon={<NotebookIcon />} href="/registroventas">
              Registro ventas
            </SidenavItem>
            <SidenavItem icon={<Rows3 />} href="/mas">
              Mas
            </SidenavItem>
          </Sidenav>
            )
    }  
    

