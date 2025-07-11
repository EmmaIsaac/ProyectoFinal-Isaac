import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router";
import { createOrder } from "../firebase/db";
import Swal from "sweetalert2";

function CheckoutForm() {
    const { cart, getTotal, clearCart } = useContext(CartContext);
    const total = getTotal();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;

        const client = { name, email, phone };

        const result = await createOrder(cart, client, total);

        if (result.success) {
            Swal.fire({
                title: "Compra realizada con éxito",
                text: `Orden ID: ${result.orderId}`,
                icon: "success",
                confirmButtonColor: "#82181a",
                confirmButtonText: "Aceptar",
            });
            clearCart();
            navigate("/");
        } else {
            const msg = result.outOfStock
                .map(
                    (item) =>
                        `${item.name} (stock disponible: ${
                            item.available ?? 0
                        })`
                )
                .join("\n");

            Swal.fire({
                title: "Stock insuficiente",
                text: `No hay suficiente stock para:\n${msg}`,
                icon: "warning",
                confirmButtonColor: "#82181a",
                confirmButtonText: "Aceptar",
            });
        }
    };

    useEffect(() => {
        if (cart.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);
    return (
        <div
            onSubmit={handleSubmit}
            className="flex justify-center pt-20 pb-10 px-4 bg-white"
        >
            <form className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-red-900 text-center">
                    Checkout
                </h1>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-1 text-sm"
                        htmlFor="name"
                    >
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-1 text-sm"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label
                        className="block text-gray-700 mb-1 text-sm"
                        htmlFor="phone"
                    >
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-900 text-white py-2 rounded-md shadow hover:bg-gray-700 transition"
                >
                    Confirmar Pedido
                </button>
            </form>
        </div>
    );
}

export default CheckoutForm;
