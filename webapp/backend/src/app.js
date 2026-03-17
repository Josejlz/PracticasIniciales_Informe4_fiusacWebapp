const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const cursosRoutes = require("./routes/cursos.routes");
const docentesRoutes = require("./routes/docentes.routes");
const publicacionesRoutes = require("./routes/publicaciones.routes");
const comentariosRoutes = require("./routes/comentarios.routes");
const aprobadosRoutes = require("./routes/aprobados.routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  return res.json({ ok: true, service: "usac-social-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/docentes", docentesRoutes);
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api/aprobados", aprobadosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;