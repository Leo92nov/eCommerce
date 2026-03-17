import { useState } from "react"
import { getCarrito } from "../firebase/firebase"
import { useEffect } from "react"

export default function CarritoComponent() {

    const [carrito, setCarrito] = useState([])

    useEffect(() => {
        getCarrito().then((carrito) => {
            setCarrito(carrito?.items || [])
        })
    }, [])

    const total = carrito.reduce((acc, p) => {
        return acc + p.price * p.cantidad
    }, 0)

    console.log(carrito);
    
    const detalle = carrito.map(p => {
        
         return{Producto: p.title,
                Cantidad: p.cantidad,
                PrecioXunidad: p.price} 
        
    });
    console.log(detalle);
    

    const handleCompra = (e) =>{

        const idTicket = crypto.randomUUID()

        e.preventDefault()

        const ticketCompra = [
            {...detalle},
            `Total de Compra: $${total}`,
            `id de ticket: ${idTicket}`
        ]
        console.log(ticketCompra);
        
    }

    return <>

        <main className="flex justify-center items-center w-full h-auto">
            <form className="w-150 h-auto bg-red-200">
                {carrito.length > 0 && carrito.map((prod, index) => (
                    <section className="w-[100%] px-20 h-auto flex flex-col justify-between py-4" key={index}>
                        <h2>{prod.title}</h2>
                        <img className="w-50 h-50" src={prod.image} alt="" />
                        <p>Cantidad: {prod.cantidad}</p>
                        <p>Precio por unidad: ${prod.price}</p>

                    </section>
                ))}
                <h2 className="text-end pr-20">Subtotal: ${total}</h2>
                <div className="flex justify-center">
                <button className="mt-12 border rounded-2xl p-2 cursor-pointer hover:bg-green-900 hover:text-white"
                        onClick={handleCompra}>
                            Realizar Compra
                </button>
                </div>
            </form>
        </main>

    </>
}