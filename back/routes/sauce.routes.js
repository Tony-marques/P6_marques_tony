const express = require("express");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  getAllSauces,
  getOneSauce,
  addSauce,
  updateSauce,
  deleteSauce,
  like,
} = require("../controllers/sauces.controllers");

// Récupération de toutes les sauces
router.get("/", auth, getAllSauces);
// Récupération d'une seule sauce grâce à l'id
router.get("/:id", auth, multer, getOneSauce);
// Enregistrement d'une nouvelle sauce
router.post("/", auth, multer, addSauce);
// Modification d'une sauce grâce à l'id
router.put("/:id", auth, multer, updateSauce);
// Suppression d'une sauce grâce à l'id
router.delete("/:id", auth, deleteSauce);
// Ajout d'un like
router.post("/:id/like", like);

module.exports = router;
