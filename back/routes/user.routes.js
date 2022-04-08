const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/users.controllers");
const password = require("../middleware/password");
const rateLimit = require("../middleware/rateLimit")


router.post("/signup", password, rateLimit, signup);
router.post("/login", password, rateLimit, login);

module.exports = router;
