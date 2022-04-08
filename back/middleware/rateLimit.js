const rateLimit = require("express-rate-limit");

console.log(rateLimit);

module.exports = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max : 2,
  message: "trop de tentative",
});
