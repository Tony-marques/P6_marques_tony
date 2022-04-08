const express = require("express");
// const { default: rateLimit } = require("express-rate-limit");
const router = express.Router();
const { signup, login } = require("../controllers/users.controllers");
const password = require("../middleware/password");
const rateLimit = require("../middleware/rateLimit")

// const limiter = rateLimit({
//   windowsMs: 15 * 60 * 1000,
//   max: 1,
//   message: "trop de tentative",
// });

// app.use(limiter())

router.post("/signup", password, rateLimit, signup);
router.post("/login", password, rateLimit, login);

module.exports = router;
