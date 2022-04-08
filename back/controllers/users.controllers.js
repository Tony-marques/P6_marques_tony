const UserModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const newUser = new UserModel({
      email: req.body.email,
      password: hash,
    });
    newUser.save();
    res.status(201).json({ message: "utilisateur créé" });
  });
};

exports.login = (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({ message: "utilisateur non trouvé" });
    } else {
      return bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ message: "password incorrect" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
          expiresIn: "24h",
        });

        res.status(200).json({
          userId: user._id,
          token: token,
        });
      });
    }
  });
};
