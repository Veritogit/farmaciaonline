async function cargarProductos() {
  const contenedor = document.getElementById("productos");

  if (!contenedor) return;

  const respuesta = await fetch("/api/productos");
  const productos = await respuesta.json();

  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    contenedor.innerHTML += `
      <div class="card">
        <h3>${producto.nombre}</h3>
        <p>Categoría: ${producto.categoria}</p>
        <p>Precio: ${producto.precio} €</p>
        <p>Stock: ${producto.stock}</p>
      </div>
    `;
  });
}

async function buscarProducto() {
  const busqueda = document.getElementById("busqueda").value;
  const resultado = document.getElementById("resultadoBusqueda");

  const respuesta = await fetch(`/api/buscar?q=${busqueda}`);
  const datos = await respuesta.json();

  resultado.innerHTML = `<h3>Resultados para: ${datos.busqueda}</h3>`;

  datos.resultados.forEach((producto) => {
    resultado.innerHTML += `
      <div class="card">
        <strong>${producto.nombre}</strong> - ${producto.precio} €
      </div>
    `;
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const respuesta = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const datos = await respuesta.json();

    document.getElementById("loginResultado").innerHTML = `
      <pre>${JSON.stringify(datos, null, 2)}</pre>
    `;
  });
}

async function consultarPedidos() {
  const usuarioId = document.getElementById("usuarioId").value;
  const contenedor = document.getElementById("pedidos");

  const respuesta = await fetch(`/api/pedidos/${usuarioId}`);
  const datos = await respuesta.json();

  contenedor.innerHTML = `<h3>Pedidos del usuario ${datos.usuarioId}</h3>`;

  datos.pedidos.forEach((pedido) => {
    contenedor.innerHTML += `
      <div class="card">
        <p>Producto: ${pedido.producto}</p>
        <p>Cantidad: ${pedido.cantidad}</p>
        <p>Estado: ${pedido.estado}</p>
      </div>
    `;
  });
}

async function cargarStockAdmin() {
  const contenedor = document.getElementById("stockAdmin");

  const respuesta = await fetch("/api/admin/stock");
  const datos = await respuesta.json();

  contenedor.innerHTML = `<h3>${datos.mensaje}</h3>`;

  datos.productos.forEach((producto) => {
    contenedor.innerHTML += `
      <div class="card">
        <p>${producto.nombre}</p>
        <p>Stock interno: ${producto.stock}</p>
      </div>
    `;
  });
}

cargarProductos();

async function consultarRecetas() {
  const usuarioId = document.getElementById("recetaUsuarioId").value;
  const contenedor = document.getElementById("recetas");

  const respuesta = await fetch(`/api/recetas/${usuarioId}`);
  const datos = await respuesta.json();

  contenedor.innerHTML = `<h3>Recetas del usuario ${datos.usuarioId}</h3>`;

  datos.recetas.forEach((receta) => {
    contenedor.innerHTML += `
      <div class="card">
        <p>Medicamento: ${receta.medicamento}</p>
        <p>Médico: ${receta.medico}</p>
        <p>Fecha: ${receta.fecha}</p>
        <p>Estado: ${receta.estado}</p>
      </div>
    `;
  });
}

const pagoForm = document.getElementById("pagoForm");

if (pagoForm) {
  pagoForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const pedidoId = document.getElementById("pedidoId").value;
    const titular = document.getElementById("titular").value;
    const tarjeta = document.getElementById("tarjeta").value;
    const cvv = document.getElementById("cvv").value;

    const respuesta = await fetch("/api/pago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pedidoId,
        titular,
        tarjeta,
        cvv
      })
    });

    const datos = await respuesta.json();

    document.getElementById("resultadoPago").innerHTML = `
      <h3>Resultado del pago</h3>
      <pre>${JSON.stringify(datos, null, 2)}</pre>
    `;
  });
}