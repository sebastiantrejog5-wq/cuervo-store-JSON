
"use strict";

// CONFIGURACIÓN DE WHATSAPP
// Reemplazar con un número autorizado.
// Ejemplo de formato: 5281XXXXXXXX
const WHATSAPP_TIENDA = "";

// Asesores de demostración
const asesores = [
    "Sebastián",
    "Julio",
    "Brayan",
    "William"
];

let productos = [];
let productoActual = null;
let asesorActual = "";

// ELEMENTOS HTML

const contenedor = document.getElementById("contenedor-productos");
const estado = document.getElementById("estado");
const totalProductos = document.getElementById("totalProductos");

const buscador = document.getElementById("buscador");
const categoria = document.getElementById("categoria");

const formulario = document.getElementById("formulario");
const formProducto = document.getElementById("formProducto");

const modal = document.getElementById("modalCompra");
const btnWhatsapp = document.getElementById("btnWhatsapp");

// IMÁGENES SVG ORIGINALES DE LOS PRODUCTOS

const dibujos = {
    playera: `
      <path d="M95 48 L130 30 L190 30 L225 48 L270 100
      L231 125 L209 98 L209 265 L111 265 L111 98
      L89 125 L50 100 Z" fill="#770024" stroke="#450017"
      stroke-width="5"/>
      <path d="M130 30 Q160 75 190 30" fill="#fff"
      stroke="#e7c7d0" stroke-width="5"/>
      <text x="160" y="160" text-anchor="middle"
      fill="white" font-size="24" font-weight="bold">TEC NL</text>
    `,
    sudadera: `
      <path d="M120 42 Q160 0 200 42 L221 65
      L269 103 L235 140 L215 119 L215 260
      L105 260 L105 119 L85 140 L51 103
      L99 65 Z" fill="#65001f" stroke="#390013"
      stroke-width="5"/>
      <path d="M120 42 Q160 115 200 42" fill="#450016"
      stroke="#9d4260" stroke-width="5"/>
      <rect x="125" y="195" width="70" height="36"
      rx="12" fill="#7e1638"/>
      <text x="160" y="160" text-anchor="middle"
      fill="white" font-size="22" font-weight="bold">CUERVO</text>
    `,
    gorra: `
      <path d="M72 162 Q75 72 158 69 Q241 72 248 162
      L248 182 L72 182 Z" fill="#700020"
      stroke="#400015" stroke-width="5"/>
      <path d="M75 178 Q164 150 255 180 Q295 195
      275 211 Q175 231 68 194 Z"
      fill="#490019" stroke="#350012" stroke-width="4"/>
      <text x="160" y="145" text-anchor="middle"
      fill="white" font-size="26" font-weight="bold">TEC NL</text>
    `,
    termo: `
      <rect x="124" y="49" width="72" height="210" rx="22"
      fill="#750024" stroke="#410015" stroke-width="5"/>
      <rect x="117" y="38" width="86" height="35" rx="10"
      fill="#33343a"/>
      <text x="160" y="158" text-anchor="middle"
      fill="white" font-size="18" font-weight="bold">CUERVO</text>
      <text x="160" y="181" text-anchor="middle"
      fill="white" font-size="17">STORE</text>
    `,
    mochila: `
      <path d="M126 75 V48 Q160 20 194 48 V75"
      fill="none" stroke="#383139" stroke-width="15"/>
      <rect x="78" y="72" width="164" height="190" rx="38"
      fill="#65001f" stroke="#3b0015" stroke-width="6"/>
      <rect x="97" y="161" width="126" height="77" rx="18"
      fill="#8c2447" stroke="#4b001a" stroke-width="4"/>
      <text x="160" y="147" text-anchor="middle"
      fill="white" font-size="22" font-weight="bold">TEC NL</text>
    `,
    libreta: `
      <rect x="82" y="36" width="164" height="235" rx="10"
      fill="#780027" stroke="#400014" stroke-width="5"/>
      <rect x="98" y="36" width="14" height="235"
      fill="#bd718a"/>
      <g fill="#ddd">
        <circle cx="90" cy="65" r="5"/>
        <circle cx="90" cy="105" r="5"/>
        <circle cx="90" cy="145" r="5"/>
        <circle cx="90" cy="185" r="5"/>
        <circle cx="90" cy="225" r="5"/>
      </g>
      <text x="175" y="137" text-anchor="middle"
      fill="white" font-size="27" font-weight="bold">CUERVO</text>
      <text x="175" y="169" text-anchor="middle"
      fill="white" font-size="22">STORE</text>
    `,
    taza: `
      <path d="M70 85 H222 V220 Q146 260 70 220 Z"
      fill="#fff" stroke="#670020" stroke-width="7"/>
      <path d="M222 112 Q290 95 277 163 Q267 197 222 183"
      fill="none" stroke="#670020" stroke-width="16"/>
      <text x="146" y="164" text-anchor="middle"
      fill="#780025" font-size="23" font-weight="bold">TEC NL</text>
    `,
    llavero: `
      <circle cx="160" cy="65" r="34" fill="none"
      stroke="#999ba2" stroke-width="13"/>
      <path d="M160 100 L160 133" stroke="#999ba2"
      stroke-width="12"/>
      <circle cx="160" cy="195" r="68" fill="#710024"
      stroke="#b9a2ab" stroke-width="9"/>
      <text x="160" y="188" text-anchor="middle"
      fill="white" font-size="24" font-weight="bold">TEC</text>
      <text x="160" y="215" text-anchor="middle"
      fill="white" font-size="22" font-weight="bold">NL</text>
    `
};

// CREAR IMAGEN DE CADA PRODUCTO

function crearImagen(tipo) {
    const dibujo = dibujos[tipo] || dibujos.llavero;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 320 300">
        <rect width="320" height="300" rx="25" fill="#f8eef1"/>
        <ellipse cx="160" cy="274" rx="95" ry="10"
          fill="#d7b9c4" opacity=".5"/>
        ${dibujo}
      </svg>
    `;

    return "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svg);
}

// FORMATO DE PRECIO

function formatoPrecio(precio) {
    return Number(precio).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

// CARGAR JSON

async function cargarProductos() {
    estado.textContent = "Cargando productos...";

    try {
        const respuesta = await fetch("./productos.json");

        if (!respuesta.ok) {
            throw new Error("No se encontró productos.json");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos.productos)) {
            throw new Error("El formato JSON es incorrecto.");
        }

        productos = datos.productos;
        mostrarProductos(productos);

    } catch (error) {
        console.error("Error:", error);

        estado.textContent =
            "No se pudieron cargar los productos: " + error.message;

        estado.classList.add("error");
        totalProductos.textContent = "Error";
    }
}

// MOSTRAR PRODUCTOS

function mostrarProductos(lista) {
    contenedor.innerHTML = "";
    estado.classList.remove("error");

    totalProductos.textContent =
        lista.length + (lista.length === 1 ? " producto" : " productos");

    if (lista.length === 0) {
        estado.textContent = "No se encontraron productos.";
        return;
    }

    estado.textContent = "";

    lista.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        const imagenContenedor = document.createElement("div");
        imagenContenedor.className = "imagen-producto";

        const imagen = document.createElement("img");
        imagen.src = crearImagen(producto.imagen);
        imagen.alt = "Imagen de " + producto.nombre;

        imagenContenedor.appendChild(imagen);

        const detalle = document.createElement("div");
        detalle.className = "detalle-producto";

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion;

        const precio = document.createElement("div");
        precio.className = "precio";
        precio.textContent = formatoPrecio(producto.precio);

        const etiqueta = document.createElement("span");
        etiqueta.className = "categoria-producto";
        etiqueta.textContent = producto.categoria;

        const boton = document.createElement("button");
        boton.className = "boton-comprar";
        boton.textContent = "Me interesa este producto";

        boton.addEventListener("click", () => {
            abrirCompra(producto);
        });

        detalle.append(
            nombre,
            descripcion,
            precio,
            etiqueta,
            boton
        );

        tarjeta.append(imagenContenedor, detalle);
        contenedor.appendChild(tarjeta);
    });
}

// BUSCAR PRODUCTOS

function filtrarProductos() {
    const texto = buscador.value.toLowerCase().trim();
    const seleccion = categoria.value;

    const resultado = productos.filter(producto => {
        const coincideTexto =
            producto.nombre.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto);

        const coincideCategoria =
            seleccion === "Todos" ||
            producto.categoria === seleccion;

        return coincideTexto && coincideCategoria;
    });

    mostrarProductos(resultado);
}

// SELECCIONAR ASESOR ALEATORIO

function obtenerAsesorAleatorio() {
    const posicion = Math.floor(Math.random() * asesores.length);
    return asesores[posicion];
}

// ABRIR VENTANA DE COMPRA

function abrirCompra(producto) {
    productoActual = producto;
    asesorActual = obtenerAsesorAleatorio();

    document.getElementById("productoSeleccionado").textContent =
        producto.nombre;

    document.getElementById("precioSeleccionado").textContent =
        "Precio: " + formatoPrecio(producto.precio);

    document.getElementById("nombreAsesor").textContent =
        "Asesor: " + asesorActual;

    const numero = WHATSAPP_TIENDA.replace(/\D/g, "");
    const configurado = /^\d{10,15}$/.test(numero);

    document.getElementById("numeroAsesor").textContent =
        configurado
            ? "WhatsApp: +" + numero
            : "WhatsApp: pendiente de configurar";

    document.getElementById("avisoWhatsapp").textContent =
        configurado
            ? "Presiona el botón para enviar tu solicitud."
            : "Modo demostración: falta registrar un número autorizado.";

    btnWhatsapp.disabled = !configurado;
    modal.classList.remove("oculto");
}

// ABRIR WHATSAPP

btnWhatsapp.addEventListener("click", () => {
    if (!productoActual) return;

    const numero = WHATSAPP_TIENDA.replace(/\D/g, "");

    if (!/^\d{10,15}$/.test(numero)) return;

    const mensaje =
        "Hola, buen día. Estoy interesado en un producto de " +
        "Cuervo Store del Tecnológico de Nuevo León.\n\n" +
        "Producto: " + productoActual.nombre + "\n" +
        "Precio: " + formatoPrecio(productoActual.precio) + "\n" +
        "Asesor asignado: " + asesorActual + "\n\n" +
        "¿Me podrían proporcionar más información?";

    const enlace =
        "https://wa.me/" + numero +
        "?text=" + encodeURIComponent(mensaje);

    window.open(enlace, "_blank", "noopener,noreferrer");
});

// CERRAR VENTANA

function cerrarCompra() {
    modal.classList.add("oculto");
    productoActual = null;
}

document.getElementById("cerrarModal")
    .addEventListener("click", cerrarCompra);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        cerrarCompra();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        cerrarCompra();
    }
});

// ABRIR FORMULARIO

document.getElementById("btnAgregar")
    .addEventListener("click", () => {
        formulario.classList.remove("oculto");
        formulario.scrollIntoView({ behavior: "smooth" });
    });

// CANCELAR FORMULARIO

document.getElementById("btnCancelar")
    .addEventListener("click", () => {
        formulario.classList.add("oculto");
        formProducto.reset();
    });

// AGREGAR PRODUCTO

formProducto.addEventListener("submit", event => {
    event.preventDefault();

    const nombre =
        document.getElementById("nombre").value.trim();

    const descripcion =
        document.getElementById("descripcion").value.trim();

    const precio =
        Number(document.getElementById("precio").value);

    const nuevaCategoria =
        document.getElementById("nuevaCategoria").value;

    if (!nombre || !descripcion ||
        !Number.isFinite(precio) || precio <= 0) {
        alert("Completa correctamente todos los campos.");
        return;
    }

    const imagenesPorCategoria = {
        "Ropa": "playera",
        "Accesorios": "termo",
        "Escolar": "libreta"
    };

    productos.push({
        id: Date.now(),
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        categoria: nuevaCategoria,
        imagen: imagenesPorCategoria[nuevaCategoria]
    });

    buscador.value = "";
    categoria.value = "Todos";

    mostrarProductos(productos);

    formProducto.reset();
    formulario.classList.add("oculto");

    alert("¡Producto agregado correctamente!");
});

// EVENTOS

buscador.addEventListener("input", filtrarProductos);
categoria.addEventListener("change", filtrarProductos);

// INICIAR

cargarProductos();
