const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'vaquita-secret-123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/auth", authRoutes);

// Páginas principales
app.get("/habitat", (req,res)=>{
  res.render("habitat");
});

app.get("/caracteristicas", (req,res)=>{
  res.render("caracteristicas");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Servidor ON ➤ http://localhost:${PORT}`));
