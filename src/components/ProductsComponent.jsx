import { useState, useEffect } from "react";
import {
  getProducts,
  filterProdsByPrice,
  updateProduct,
  getCarrito,
  updateCarrito,
  deleteCarrito,
} from "../firebase/firebase";

export default function ProductsComponent() {
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [categoriasActivas, setCategoriasActivas] = useState([]);
  const [precioMax, setPrecio] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [alCarro, setAlCarro] = useState([]);
  const [condicion, setCondicion] = useState([]);

  useEffect(() => {
    getProducts().then((prod) => {
      setProductos(prod);
      setProductosOriginales(prod);
    });
  }, []);

  useEffect(() => {
    getCarrito().then((carrito) => {
      setAlCarro(carrito?.items || []);
    });
  }, []);

  const aplicarFiltros = (categorias = categoriasActivas, condiciones = condicion) => {
    let filtrados = [...productosOriginales];

    if (categorias.length > 0) {
      filtrados = filtrados.filter((p) => categorias.includes(p.Categoria));
    }

    if (condiciones.length > 0) {
      filtrados = filtrados.filter((p) => condiciones.includes(p.condition));
    }

    setProductos(filtrados);
  };

  const handleClick = async () => {
    if (precioMax === "") {
      aplicarFiltros();
      return;
    }

    const max = Number(precioMax);
    const prodPorPrecio = await filterProdsByPrice(max);

    let filtrados = [...prodPorPrecio];

    if (categoriasActivas.length > 0) {
      filtrados = filtrados.filter((p) =>
        categoriasActivas.includes(p.Categoria)
      );
    }

    if (condicion.length > 0) {
      filtrados = filtrados.filter((p) => condicion.includes(p.condition));
    }

    setProductos(filtrados);
  };

  const hadleUpdate = async (event) => {
    await updateProduct(event.target.id, { price: 180 });
    const prod = await getProducts();
    setProductos(prod);
    setProductosOriginales(prod);
  };

  const handleAumento = (id, stock) => {
    const key = String(id);
    const max = Number(stock ?? Infinity);

    setCantidades((prev) => {
      const actual = Number(prev[key] ?? 0);
      if (actual >= max) return prev;
      return { ...prev, [key]: actual + 1 };
    });
  };

  const handleDisminucion = (id) => {
    const key = String(id);

    setCantidades((prev) => {
      const actual = Number(prev[key] ?? 0);
      if (actual <= 0) return prev;
      return { ...prev, [key]: actual - 1 };
    });
  };

  const handleAgregarAlCarro = async (id) => {
    const key = String(id);

    const carrito = await getCarrito();
    const productoSenalado = productos.find((p) => String(p.id) === key);

    if (!productoSenalado) return;

    const cantidadSeleccionada = Number(cantidades[key] ?? 0);
    if (cantidadSeleccionada <= 0) return;

    const nuevoProducto = {
      id: productoSenalado.id,
      title: productoSenalado.title,
      price: productoSenalado.price,
      image: productoSenalado.image,
      cantidad: cantidadSeleccionada,
    };

    const itemsActuales = carrito?.items || [];

    const productoYaAgregado = itemsActuales.find(
      (p) => p.title === nuevoProducto.title
    );

    let nuevoCarrito;

    if (productoYaAgregado) {
      nuevoCarrito = itemsActuales.map((p) =>
        p.title === nuevoProducto.title
          ? { ...p, cantidad: p.cantidad + nuevoProducto.cantidad }
          : p
      );
    } else {
      nuevoCarrito = [...itemsActuales, nuevoProducto];
    }

    setAlCarro(nuevoCarrito);
    await updateCarrito(nuevoCarrito);

    setCantidades((prev) => ({
      ...prev,
      [key]: 0,
    }));
  };

  const handleWipeCarrito = async () => {
    await deleteCarrito([]);
    setAlCarro([]);
  };

  const handleOnChange = (e) => {
    const checked = e.target.checked;
    const category = e.target.value;

    let nuevasCategorias;

    if (checked) {
      nuevasCategorias = [...categoriasActivas, category];
    } else {
      nuevasCategorias = categoriasActivas.filter((cat) => cat !== category);
    }

    setCategoriasActivas(nuevasCategorias);
    aplicarFiltros(nuevasCategorias, condicion);
  };

  const handleOnChangeNU = (e) => {
    const checked = e.target.checked;
    const conditionValue = e.target.value;

    let nuevasCondiciones;

    if (checked) {
      nuevasCondiciones = [...condicion, conditionValue];
    } else {
      nuevasCondiciones = condicion.filter((c) => c !== conditionValue);
    }

    setCondicion(nuevasCondiciones);
    aplicarFiltros(categoriasActivas, nuevasCondiciones);
  };

  return (
    <main className="flex flex-col lg:flex-row gap-8 px-6 py-8 bg-gray-50 min-h-screen">
      <aside className="w-full lg:w-72 bg-white shadow-lg rounded-3xl p-6 h-fit border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Filtrar productos
        </h2>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            Precio máximo
          </h3>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Ej: 50000"
              value={precioMax}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-black"
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition cursor-pointer"
              onClick={handleClick}
            >
              Filtrar
            </button>
          </div>
        </div>

        <div className="my-6 border-t border-gray-200"></div>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Categorías</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="Perifericos"
                checked={categoriasActivas.includes("Perifericos")}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Periféricos</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="Motherboards"
                checked={categoriasActivas.includes("Motherboards")}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Motherboards</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="Microprocesadores"
                checked={categoriasActivas.includes("Microprocesadores")}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Microprocesadores</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="Videos"
                checked={categoriasActivas.includes("Videos")}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Placas de video</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="Refrigeracion"
                checked={categoriasActivas.includes("Refrigeracion")}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Refrigeración</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="Almacenamiento"
                checked={categoriasActivas.includes("Almacenamiento")}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Almacenamiento</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="RAM"
                checked={categoriasActivas.includes("RAM")}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Memorias RAM</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="Gabinetes"
                checked={categoriasActivas.includes("Gabinetes")}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Gabinetes</span>
            </label>
          </div>
        </section>

        <div className="my-6 border-t border-gray-200"></div>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Condición</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="new"
                checked={condicion.includes("new")}
                onChange={handleOnChangeNU}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Nuevo</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value="used"
                checked={condicion.includes("used")}
                onChange={handleOnChangeNU}
                className="cursor-pointer"
              />
              <span className="text-gray-700">Usado</span>
            </label>
          </div>
        </section>
      </aside>

      <section className="flex flex-wrap justify-center lg:justify-start w-full gap-8">
        {productos.map((prod) => {
          const id = String(prod.id);
          const cant = Number(cantidades[id] ?? 0);
          const stock = Number(prod.stock ?? 0);

          return (
            <article
              key={id}
              className="w-[280px] bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="w-full h-52 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <img
                  className="w-full h-full object-contain"
                  src={prod.image}
                  alt={prod.title}
                />
              </div>

              <div className="p-5 flex flex-col gap-3">
                <h2 className="text-lg font-bold text-gray-900 text-center min-h-[56px] flex items-center justify-center">
                  {prod.title}
                </h2>

                <p className="text-3xl font-extrabold text-green-600 text-center">
                  ${prod.price}
                </p>

                <p className="text-sm text-gray-600 text-center min-h-[60px] line-clamp-3">
                  {prod.description}
                </p>

                <p className="text-sm text-gray-700 text-center font-medium">
                  Stock actual: <span className="font-bold">{prod.stock}</span>
                </p>

                <div className="flex justify-around items-center mt-2 bg-gray-100 rounded-2xl py-2 px-3">
                  <button
                    onClick={() => handleDisminucion(id)}
                    disabled={cant === 0}
                    className="text-2xl font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 transition"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={cant}
                    readOnly
                    className="w-16 text-center bg-white border border-gray-300 rounded-lg py-1 appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none"
                  />

                  <button
                    onClick={() => handleAumento(id, stock)}
                    disabled={cant >= stock}
                    className="text-2xl font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={cant === 0}
                  onClick={() => handleAgregarAlCarro(id)}
                  className="mt-3 bg-gray-300 text-black py-3 rounded-2xl font-semibold hover:bg-gray-800 hover:bg-green-800 hover:text-white cursor-pointer transition disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed"
                >
                  Agregar al carrito
                </button>

                <button
                  onClick={handleWipeCarrito}
                  className="border border-gray-300 py-3 rounded-2xl cursor-pointer hover:bg-red-500 hover:text-white font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Limpiar carrito
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}