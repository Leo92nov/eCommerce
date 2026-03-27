import { useState, useEffect } from "react";
import { carritoExtension } from "../firebase/firebase";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    const unsubscribe = carritoExtension((num) => {
      setCantidad(num);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Link to="/CarritoComponent">
      <div
        className="fixed bottom-6 right-6 z-50 
        w-18 h-18 rounded-full 
        bg-black text-white 
        flex items-center justify-center 
        shadow-lg hover:shadow-2xl 
        hover:scale-110 transition-all duration-300 cursor-pointer"
      >
        {/* Ícono carrito */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 6.45a1 1 0 001 .55h12.7a1 1 0 001-.8L21 13M7 13h14M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
          />
        </svg>

        {/* Badge cantidad */}
        {cantidad > 0 && (
          <span
            className="absolute -top-1 -right-1 
            bg-red-500 text-white text-xs font-bold 
            w-8 h-8 flex items-center justify-center 
            rounded-full shadow-md animate-bounce"
          >
            {cantidad}
          </span>
        )}
      </div>
    </Link>
  );
}