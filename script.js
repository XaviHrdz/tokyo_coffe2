
// =====================================
// TOKYO COFFEE - JAVASCRIPT
// =====================================

// CONFIGURACIÓN
// Reemplazar con el WhatsApp real del negocio.
// Ejemplo: 5212221234567
const numeroWhatsApp = "521XXXXXXXXXX";

// CATÁLOGO DE PRODUCTOS
const productos = [
    {
        id: 1,
        nombre: "Espresso",
        precio: 45,
        categoria: "calientes",
        imagen: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600"
    },
    {
        id: 2,
        nombre: "Capuchino",
        precio: 65,
        categoria: "calientes",
        imagen: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600"
    },
    {
        id: 3,
        nombre: "Latte",
        precio: 70,
        categoria: "calientes",
        imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600"
    },
    {
        id: 4,
        nombre: "Café frío",
        precio: 75,
        categoria: "frios",
        imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600"
    },
    {
        id: 5,
        nombre: "Frappé",
        precio: 85,
        categoria: "frios",
        imagen: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600"
    },
    {
        id: 6,
        nombre: "Cheesecake",
        precio: 80,
        categoria: "postres",
        imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600"
    }
];

// CARRITO
let carrito = [];

// ELEMENTOS HTML
const listaProductos = document.getElementById("lista-productos");
const listaCarrito = document.getElementById("lista-carrito");
const contador = document.getElementById("contador");
const totalElemento = document.getElementById("total");

const formatoPrecio = (precio) =>
    `$${precio.toLocaleString("es-MX")} MXN`;

// =====================================
// MOSTRAR PRODUCTOS
// =====================================

function mostrarProductos(categoria = "todos") {
    listaProductos.innerHTML = "";

    const filtrados = productos.filter(producto =>
        categoria === "todos" ||
        producto.categoria === categoria
    );

    filtrados.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        tarjeta.innerHTML = `
            <img src="${producto.imagen}"
                 alt="${producto.nombre}"
                 loading="lazy">

            <h3>${producto.nombre}</h3>
            <p>Preparado especialmente para ti.</p>
            <span>${formatoPrecio(producto.precio)}</span>

            <button class="agregar"
                    data-id="${producto.id}">
                Agregar al carrito +
            </button>
        `;

        listaProductos.appendChild(tarjeta);
    });
}

// =====================================
// FILTRAR POR CATEGORÍA
// =====================================

document.querySelectorAll(".filtro").forEach(boton => {
    boton.addEventListener("click", () => {
        document.querySelectorAll(".filtro").forEach(b =>
            b.classList.remove("activo")
        );

        boton.classList.add("activo");

        mostrarProductos(boton.dataset.categoria);
    });
});

// =====================================
// AGREGAR PRODUCTOS
// =====================================

listaProductos.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".agregar");

    if (!boton) return;

    const id = Number(boton.dataset.id);
    agregarCarrito(id);
});

function agregarCarrito(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    const existente = carrito.find(p => p.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarCarrito();
}

// =====================================
// ACTUALIZAR CARRITO
// =====================================

function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML =
            "<p>Tu carrito está vacío.</p>";
    }

    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;

        const item = document.createElement("div");
        item.className = "item-carrito";

        item.innerHTML = `
            <div>
                <strong>${producto.nombre}</strong>
                <p>
                    ${producto.cantidad} x
                    ${formatoPrecio(producto.precio)}
                </p>
            </div>

            <button class="eliminar"
                    data-id="${producto.id}">
                Eliminar
            </button>
        `;

        listaCarrito.appendChild(item);
    });

    contador.textContent = cantidadTotal;
    totalElemento.textContent = formatoPrecio(total);
}

// =====================================
// ELIMINAR PRODUCTO
// =====================================

listaCarrito.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".eliminar");

    if (!boton) return;

    const id = Number(boton.dataset.id);

    carrito = carrito.filter(producto =>
        producto.id !== id
    );

    actualizarCarrito();
});

// =====================================
// VACIAR CARRITO
// =====================================

document.getElementById("vaciar-carrito")
    .addEventListener("click", () => {
        carrito = [];
        actualizarCarrito();
    });

// =====================================
// PEDIDO POR WHATSAPP
// =====================================

document.getElementById("pedir-whatsapp")
    .addEventListener("click", () => {

        if (carrito.length === 0) {
            alert("Agrega productos antes de realizar tu pedido.");
            return;
        }

        if (!/^\d{10,15}$/.test(numeroWhatsApp)) {
            alert("Configura el número de WhatsApp del negocio.");
            return;
        }

        let mensaje = "☕ *Nuevo pedido - Tokyo Coffee*\n\n";

        carrito.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;

            mensaje += `${producto.cantidad} x ${producto.nombre} - ${formatoPrecio(subtotal)}\n`;
        });

        const total = carrito.reduce(
            (suma, p) => suma + p.precio * p.cantidad,
            0
        );

        mensaje += `\n*Total: ${formatoPrecio(total)}*`;
        mensaje += "\n\nHola, quisiera confirmar mi pedido.";

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    });

// INICIAR
mostrarProductos();
actualizarCarrito();
