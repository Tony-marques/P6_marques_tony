const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.token = jwt.verify(token, process.env.SECRET_KEY);

    if (req.body.userId && req.body.userId !== req.token.userId) {
      throw "User Id non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ erreur: "Requête non authentifiée" });
  }
};
// const token = req.headers.authorization.split(" ")[1];
//   if (token) {
//     jwt.verify(token, "RANDOM_TOKEN_SECRET", (err, decodedToken) => { // mettre la clé secrète dans le .env
//       if (err) {
//         res.status(401).json({ erreur: "Requête non authentifiée" });
//       } else {
//         req.token = decodedToken.token;
//         console.log(req.token);
//         next()
//       }
//     });
//   } else {
//     res.status(401).json({ erreur: "Requête non authentifiée" });
//   }
// };
