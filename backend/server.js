const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3001;

const {
  DB_HOST = "libreria-db",
  DB_USER = "root",
  DB_PASSWORD = "admin123",
  DB_NAME = "tienda_libreria",
  DB_PORT = 3306,
} = process.env;

app.use(cors());
app.use(express.json());

let pool;

// Inicializar pool de conexiones
async function initDb() {
  try {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Pool de conexiones MySQL inicializado.");
  } catch (err) {
    console.error("Error al inicializar pool de MySQL:", err);
  }
}

// Helper para manejar errores
function handleError(res, error, message = "Error interno del servidor") {
  console.error(error);
  res.status(500).json({ message });
}

// Obtener todos los libros
app.get("/api/libros", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, titulo, autor, precio, stock FROM libros ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    handleError(res, err, "No se pudieron obtener los libros.");
  }
});

// Obtener un libro por ID
app.get("/api/libros/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT id, titulo, autor, precio, stock FROM libros WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Libro no encontrado." });
    }
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err, "No se pudo obtener el libro.");
  }
});

// Crear un nuevo libro
app.post("/api/libros", async (req, res) => {
  const { titulo, autor, precio, stock } = req.body;

  if (!titulo || !autor || precio == null || stock == null) {
    return res.status(400).json({ message: "Título, autor, precio y stock son obligatorios." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO libros (titulo, autor, precio, stock) VALUES (?, ?, ?, ?)",
      [titulo, autor, precio, stock]
    );
    const nuevoId = result.insertId;
    const [rows] = await pool.query("SELECT id, titulo, autor, precio, stock FROM libros WHERE id = ?", [nuevoId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    handleError(res, err, "No se pudo crear el Libro.");
  }
});

// Actualizar un libro
app.put("/api/libros/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, autor, precio, stock } = req.body;

  if (!titulo || !autor || precio == null || stock == null) {
    return res.status(400).json({ message: "Título, autor, precio y stock son obligatorios." });
  }

  try {
    const [result] = await pool.query(
      "UPDATE libros SET titulo = ?, autor = ?, precio = ?, stock = ? WHERE id = ?",
      [titulo, autor, precio, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Libro no encontrado." });
    }

    const [rows] = await pool.query("SELECT id, titulo, autor, precio, stock FROM libros WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err, "No se pudo actualizar el Libro.");
  }
});

// Eliminar un libro
app.delete("/api/libros/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM libros WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Libro no encontrado." });
    }
    res.json({ message: "Libro eliminado correctamente." });
  } catch (err) {
    handleError(res, err, "No se pudo eliminar el Libro.");
  }
});

// Endpoint de salud para Kubernetes
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend de tienda de libros en ejecución."
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
  await initDb();
});
