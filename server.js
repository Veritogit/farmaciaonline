const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware básico
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Base de datos simulada
const usuarios = [
  {
    id: 1,
    nombre: "Cliente Demo",
    email: "cliente@farmacia.com",
    password: "123456",
    rol: "cliente"
  },
  {
    id: 2,
    nombre: "Administrador",
    email: "admin@farmacia.com",
    password: "admin123",
    rol: "admin"
  }
];

const productos = [
  {
    id: 1,
    nombre: "Paracetamol 500mg",
    categoria: "Analgésicos",
    precio: 3.95,
    stock: 25
  },
  {
    id: 2,
    nombre: "Ibuprofeno 400mg",
    categoria: "Antiinflamatorios",
    precio: 4.25,
    stock: 18
  },
  {
    id: 3,
    nombre: "Vitamina C",
    categoria: "Suplementos",
    precio: 7.5,
    stock: 40
  },
  {
    id: 4,
    nombre: "Crema solar SPF 50",
    categoria: "Dermocosmética",
    precio: 14.99,
    stock: 12
  }
];

const pedidos = [
  {
    id: 1,
    usuarioId: 1,
    producto: "Paracetamol 500mg",
    cantidad: 2,
    estado: "Preparando"
  },
  {
    id: 2,
    usuarioId: 1,
    producto: "Vitamina C",
    cantidad: 1,
    estado: "Enviado"
  }
];

const recetas = [
  {
    id: 1,
    usuarioId: 1,
    medicamento: "Amoxicilina 500mg",
    medico: "Dr. García",
    fecha: "2026-05-01",
    estado: "Pendiente de validación"
  },
  {
    id: 2,
    usuarioId: 1,
    medicamento: "Ibuprofeno 600mg",
    medico: "Dra. López",
    fecha: "2026-05-08",
    estado: "Validada"
  },
  {
    id: 3,
    usuarioId: 2,
    medicamento: "Omeprazol 20mg",
    medico: "Dr. Martín",
    fecha: "2026-05-10",
    estado: "Validada"
  }
];

const facturas = [];
// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Obtener productos
app.get("/api/productos", (req, res) => {
  res.json(productos);
});

// Buscador vulnerable a inyección lógica / falta de validación
app.get("/api/buscar", (req, res) => {
  const q = req.query.q || "";

  const resultado = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(q.toLowerCase())
  );

  res.json({
    busqueda: q,
    resultados: resultado
  });
});

// Login inseguro de ejemplo
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const usuario = usuarios.find(
    (u) => u.email === email && u.password === password
  );

  if (!usuario) {
    return res.status(401).json({
      mensaje: "Credenciales incorrectas",
      detalle: "El email o la contraseña no coinciden con ningún usuario registrado"
    });
  }

  res.json({
    mensaje: "Login correcto",
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  });
});

// Vulnerabilidad A01 Broken Access Control
// Permite consultar pedidos de cualquier usuario cambiando el ID
app.get("/api/pedidos/:usuarioId", (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId);

  const pedidosUsuario = pedidos.filter((pedido) => pedido.usuarioId === usuarioId);

  res.json({
    usuarioId: usuarioId,
    pedidos: pedidosUsuario
  });
});

// BackOffice vulnerable
// No comprueba si el usuario es administrador
app.get("/api/admin/stock", (req, res) => {
  res.json({
    mensaje: "Acceso al stock interno de la farmacia",
    productos: productos
  });
});

// Gestión insegura de errores
app.get("/api/error-demo", (req, res) => {
  try {
    throw new Error("Error interno de conexión con la base de datos farmacia_db");
  } catch (error) {
    res.status(500).json({
      mensaje: "Error interno del servidor",
      detalleTecnico: error.message,
      stack: error.stack
    });
  }
});
// Gestión de recetas vulnerable
// Permite consultar recetas de cualquier usuario cambiando el ID
app.get("/api/recetas/:usuarioId", (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId);

  const recetasUsuario = recetas.filter((receta) => receta.usuarioId === usuarioId);

  res.json({
    usuarioId: usuarioId,
    recetas: recetasUsuario
  });
});

// Simulación de pago TPV
app.post("/api/pago", (req, res) => {
  const { pedidoId, titular, tarjeta, cvv } = req.body;

  if (!pedidoId || !titular || !tarjeta || !cvv) {
    return res.status(400).json({
      mensaje: "Faltan datos para procesar el pago"
    });
  }

  const factura = {
    id: facturas.length + 1,
    pedidoId: pedidoId,
    titular: titular,
    tarjetaParcial: tarjeta,
    cvv: cvv,
    estado: "Pago simulado aceptado",
    fecha: new Date().toISOString()
  };

  facturas.push(factura);

  res.json({
    mensaje: "Pago TPV simulado correctamente",
    factura: factura
  });
});

// Consulta de facturas generadas
app.get("/api/facturas", (req, res) => {
  res.json({
    mensaje: "Listado de facturas simuladas",
    facturas: facturas
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});