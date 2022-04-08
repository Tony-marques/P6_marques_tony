const { urlencoded } = require("express");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const saucesRoutes = require("./routes/sauce.routes");
const authRoutes = require("./routes/user.routes");


const PORT = process.env.PORT;
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// app.use(
//   mongoSanitize({
//     replaceWith: "_",
//   })
// );

app.use("/images", express.static(path.join(__dirname, "images")));
// Les routes sauces
app.use("/api/sauces", saucesRoutes);
// les routes auth
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
