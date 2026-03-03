import { useState } from "react"
import { addOrder } from "../firebase/firebase"

export default function AddOrders(){

    const [orderId, setOrderId] = useState(null)

    const ordenDeCompra = {
        buyer:{
            name: "Pepe",
            phone: "12235666498",
            email: "pepe@gmail.com"
        }, items:[
            {id:"asd5as41d5",
             title: "tablet",
             price: 10000
            }
        ]
    }

    const handleClick = () =>{

        addOrder(ordenDeCompra)
        .then(id => setOrderId(id))
    }

    return <>
    
        <button onClick={handleClick} className="border">Enviar orden</button>
        {orderId && <p> Se ha generado la orden de compra id: {orderId}</p>}
    </>
}