import { useState, useEffect } from "react";
import { compraHecha, getCarrito, getProducts } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CarritoComponent() {
    const [carrito, setCarrito] = useState([]);
    const [open, setOpen] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [products, setProducts] = useState([])

    useEffect(() => {
        getProducts().then((prod) => {
            setProducts(prod) 
        })
    }, [])

    useEffect(() => {
        getCarrito().then((carritoData) => {
            setCarrito(carritoData?.items || []);
        });
    }, []);

    const total = carrito.reduce((acc, p) => {
        return acc + p.price * p.cantidad;
    }, 0);

    const detalle = carrito.map((p) => ({
        id: p.id,
        producto: p.title,
        cantidad: p.cantidad,
        precioXunidad: p.price,
        subtotal: p.price * p.cantidad,
    }));

    const handleCompra = (e) => {
        e.preventDefault();

        const idTicket = crypto.randomUUID();

        const ticketCompra = {
            idCompra: idTicket,
            productos: detalle,
            total: total,
        };
        console.log(ticketCompra);


        setTicket(ticketCompra);
        setOpen(true);
    };

    const handleCompraFinalizada = async (event) => {
        console.log(carrito);

        event.preventDefault()
        const productosStock = await compraHecha()
        console.log(productosStock);


        const nProductos = carrito.map((prod) => {
            const productoReal = productosStock.find((p) => p.id === prod.id);

            return {
                ...productoReal,
                stock: productoReal.stock - prod.cantidad
            };
        });

        const nuevoStock = productosStock.map((prod) => {
            const actualizar = nProductos.find((p) => p.id === prod.id)


            if (actualizar) {
                return {
                    ...actualizar,
                }
            } else {
                return prod
            }
        })
        console.table(nuevoStock);
        
         setProducts(nuevoStock); 
        console.log(products);
        

        ;
        Swal.fire({
            title: "Compra realizada",
            text: "Todo salió perfecto",
            icon: "success",
            confirmButtonText: "Genial"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/");
            }
        });

    }

    return (
        <main className="flex justify-center items-center w-full h-auto mb-16">
            <form className="w-150 flex flex-col h-auto bg-blue-200">
                {carrito.length > 0 &&
                    carrito.map((prod, index) => (
                        <section
                            className="w-[100%] px-20 h-auto flex flex-col items-center py-4"
                            key={index}
                        >
                            <h2>{prod.title}</h2>
                            <img className="w-50 h-50" src={prod.image} alt={prod.title} />
                            <p>Cantidad: {prod.cantidad}</p>
                            <p>Precio por unidad: ${prod.price}</p>
                        </section>
                    ))}

                <h2 className="text-center my-8">Subtotal: ${total}</h2>

                <div className="flex justify-center">
                    <button
                        type="button"
                        className="my-12 border rounded-2xl p-2 cursor-pointer hover:bg-green-900 hover:text-white"
                        onClick={handleCompra}
                    >
                        Encargar
                    </button>
                </div>
            </form>

            {open && ticket && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <section className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
                        <h1 className="text-xl font-bold mb-4">Compra realizada</h1>

                        <h2 className="mb-2">
                            <span className="font-semibold">ID de compra:</span>{" "}
                            {ticket.idCompra}
                        </h2>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Productos:</h3>

                            {ticket.productos.map((e, index) => (
                                <div key={index} className="border-b py-2">
                                    <p>Producto: {e.producto}</p>
                                    <p>Cantidad: {e.cantidad}</p>
                                    <p>Precio por unidad: ${e.precioXunidad}</p>
                                    <p>Subtotal: ${e.subtotal}</p>
                                </div>
                            ))}
                        </div>

                        <h2 className="font-bold mb-4">Total: ${ticket.total}</h2>

                        <button
                            type="button"
                            className="border rounded-xl px-4 py-2 hover:bg-green-800 hover:text-white cursor-pointer"
                            onClick={handleCompraFinalizada}
                        >
                            Realizar Compra
                        </button>
                    </section>
                </div>
            )}
        </main>
    );
}