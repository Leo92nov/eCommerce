import { useState, useEffect } from "react";
import {
  getCarrito,
  getProducts,
  updateStock,
  carritoExtension,
  updateCarrito,
} from "../firebase/firebase";
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


  const handleClick = async (id) => {
     const carritoUP = carrito.filter(p => p.id !== id)
     
    setCarrito(carritoUP)
    await updateCarrito(carritoUP)
  }

  const handleCompra = (e) => {
    e.preventDefault();

    if (carrito.length === 0) {
      Swal.fire({
        title: "Tu carrito está vacío",
        text: "Agregá al menos un producto antes de continuar",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

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
      await updateCarrito([]);
      setCarrito([]);
      setOpen(false);

      Swal.fire({
        title: "Compra realizada",
        text: "Todo salió perfecto",
        icon: "success",
        confirmButtonText: "Genial",
      }).then((result) => {
        if (result.isConfirmed) {
          carritoExtension(0);
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-10">
      <section className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Tu carrito
          </h1>
          <p className="text-gray-500 mt-2">
            Revisá tus productos antes de finalizar la compra
          </p>
        </div>

        {carrito.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 mb-6">
              Todavía no agregaste productos. Volvé a la tienda y elegí algo copado.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition cursor-pointer"
            >
              Ir a la tienda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
            <form className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Productos seleccionados
                </h2>
              </div>

              <div className="p-6 flex flex-col gap-5">
                {carrito.map((prod, index) => (
                  <article
                    key={index}
                    className="flex flex-col md:flex-row items-center gap-5 bg-gray-50 border border-gray-100 rounded-3xl p-5 hover:shadow-md transition"
                  >
                    <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center p-3 shrink-0">
                      <img
                        className="w-full h-full object-contain"
                        src={prod.image}
                        alt={prod.title}
                      />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {prod.title}
                      </h2>

                      <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 text-sm text-gray-600">
                        <p className="bg-white px-3 py-1 rounded-xl border border-gray-200">
                          Cantidad: <span className="font-semibold">{prod.cantidad}</span>
                        </p>
                        <p className="bg-white px-3 py-1 rounded-xl border border-gray-200">
                          Precio unitario:{" "}
                          <span className="font-semibold">${prod.price}</span>
                        </p>
                        <p className="bg-white px-3 py-1 rounded-xl border border-gray-200">
                          Subtotal:{" "}
                          <span className="font-semibold">
                            ${prod.price * prod.cantidad}
                          </span>
                        </p>
                        <button onClick={() => handleClick(prod.id)} className="bg-white px-3 py-1 rounded-xl border border-gray-200 cursor-pointer hover:text-white hover:bg-red-500">Eliminar</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </form>

            <aside className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Resumen
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Productos</span>
                  <span>{carrito.length}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Unidades totales</span>
                  <span>
                    {carrito.reduce((acc, p) => acc + p.cantidad, 0)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Total
                  </span>
                  <span className="text-3xl font-extrabold text-green-600">
                    ${total}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full mt-8 bg-black text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 transition cursor-pointer"
                onClick={handleCompra}
              >
                Encargar
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Seguir comprando
              </button>
            </aside>
          </div>
        )}
      </section>

      {open && ticket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <section className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-white/40">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-5 border-b border-gray-100 rounded-t-3xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    Confirmar compra
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Revisá el detalle antes de finalizar
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">ID de compra</p>
                <p className="font-mono text-sm md:text-base text-gray-800 break-all">
                  {ticket.idCompra}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Productos
                </h3>

                <div className="space-y-3">
                  {ticket.productos.map((e, index) => (
                    <article
                      key={index}
                      className="border border-gray-100 rounded-2xl p-4 bg-gray-50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-base font-bold text-gray-900">
                            {e.producto}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Cantidad: {e.cantidad}
                          </p>
                        </div>

                        <div className="text-sm md:text-right text-gray-700">
                          <p>Precio por unidad: ${e.precioXunidad}</p>
                          <p className="font-semibold text-gray-900">
                            Subtotal: ${e.subtotal}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5 flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-800">
                  Total final
                </span>
                <span className="text-3xl font-extrabold text-green-600">
                  ${ticket.total}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  Seguir viendo
                </button>

                <button
                  type="button"
                  className="flex-1 bg-black text-white rounded-2xl px-4 py-3 font-semibold hover:bg-gray-800 transition cursor-pointer"
                  onClick={handleCompraFinalizada}
                >
                  Realizar compra
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}