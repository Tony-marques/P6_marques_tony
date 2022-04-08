const SauceModel = require("../models/sauces.model");
const fs = require("fs");

exports.getAllSauces = (req, res) => {
  SauceModel.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.getOneSauce = (req, res) => {
  const { id } = req.params;
  SauceModel.findOne({ _id: id })
    .then((sauce) => {
      return res.status(200).json(sauce);
    })
    .catch((err) => res.status(401).json({ erreur: "Unauthorized" }));
};

exports.addSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(req.body);
  delete sauceObject._id;
  const sauce = new SauceModel({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateSauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        ...req.body,
      };
  const { id } = req.params;
  SauceModel.findOne({ _id: id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      SauceModel.updateOne({ _id: id }, { ...sauceObject, _id: id })
        .then((sauce) => {
          return res.status(200).json({ message: `${sauce._id} modifiée` });
        })
        .catch((err) => res.status(400).json({ err }));
    });
  });
};

exports.deleteSauce = (req, res) => {
  const { id } = req.params;

  SauceModel.findOne({ _id: id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      SauceModel.findOneAndRemove({ _id: id }).then(() => {
        return res.status(200).json({ message: `Sauce ${id} supprimée` });
      });
    });
  });
};

exports.like = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  // on va chercher la sauce selectionnée
  SauceModel.findOne({ _id: req.params.id })
    .then((sauce) => {
      // on vérifie si l'user a déjà aimé pour éviter de liker plusieurs fois
      // (= son id est dans le tableau usersLiked)
      let userLike = sauce.usersLiked.find((id) => id === userId);
      // on vérifie si l'user a déjà disliké
      let userDislike = sauce.usersDisliked.find((id) => id === userId);

      switch (like) {
        // si like = 1, l'utilisateur aime
        case 1:
          // si l'utilisateur n'a pas encore liké
          // on ajoute un like et l'userId dans le tableau correspondant
          if (!userLike) {
            sauce.likes += 1;
            sauce.usersLiked.push(userId);
          } else {
            // si l'utilisateur a déjà liké, on envoi une erreur
            throw new Error("un seul like possible!");
          }
          // si l'utilisateur avait déjà fait un dislike, message erreur
          if (userDislike) {
            throw new Error("annuler votre dislike avant de liker!");
          }
          break;

        // si like = 0, l'utilisateur annule son like
        case 0:
          // si l'utilisateur a déjà liké,
          // on retire le like et le userId du tableau (on garde ceux qui ont un id différents)
          if (userLike) {
            sauce.likes -= 1;
            sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
          }
          // si l'uitlisateur a déjà disliké,
          // on retire le dislike et le userId du tableau
          else {
            //let userDisliked = sauce.usersDisliked.find(id => id === userId);
            if (userDislike) {
              sauce.dislikes -= 1;
              sauce.usersDisliked = sauce.usersDisliked.filter(
                (id) => id !== userId
              );
            }
          }
          break;

        // si like = -1, l'utilisateur n'aime pas
        case -1:
          // si l'user n'a pas encore disliké
          // on ajoute 1 dislikes et l'userId dans le tableau correspondant
          if (!userDislike) {
            sauce.dislikes += 1;
            sauce.usersDisliked.push(userId);
          } else {
            // si l'utilisateur a déjà disliké, on envoi une erreur
            throw new Error("un seul dislike possible!");
          }
          // si l'utilisateur avait déjà fait un like, message erreur
          if (userLike) {
            throw new Error("annuler votre like avant de disliker!");
          }
      }
      // sauvegarde la sauce avec like/dislike modifiés
      sauce
        .save()
        .then(() =>
          res.status(201).json({ message: "préférence enregistrée !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
