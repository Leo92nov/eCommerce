import { useState, useEffect } from "react";
import { getCarrito, getProducts, updateStock, carritoExtension, updateCarrito } from "../firebase/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function CarritoComponent() {
  const [carrito, setCarrito] = useState([]);
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then((prod) => {
      setProducts(prod);
    });
  }, []);

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

    setTicket(ticketCompra);
    setOpen(true);
  };

  const handleCompraFinalizada = async (event) => {
    event.preventDefault();

    try {
      const productosDB = await getProducts();

      const productosActualizados = carrito.map((prodCarrito) => {
        const productoReal = productosDB.find((p) => p.id === prodCarrito.id);

        console.log(productoReal);
        

        if (!productoReal) {
          throw new Error(`No se encontró el producto ${prodCarrito.title}`);
        }

        if (prodCarrito.cantidad > productoReal.stock) {
          throw new Error(
            `No hay stock suficiente para ${productoReal.title}`
          );
        }

        return {
          id: productoReal.id,
          stock: productoReal.stock - prodCarrito.cantidad,
        };
      });

      await updateStock(productosActualizados);
      await updateCarrito([])
      Swal.fire({
        title: "Compra realizada",
        text: "Todo salió perfecto",
        icon: "success",
        confirmButtonText: "Genial",
      }).then((result) => {
        if (result.isConfirmed) {
        carritoExtension(0)
          navigate("/");
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Ocurrió un problema al finalizar la compra",
        icon: "error",
        confirmButtonText: "Entendido",
      });
    }
  };

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