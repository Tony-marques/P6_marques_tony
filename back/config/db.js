const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.1nzoh.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log(`Connexion à MongoDB réussie`);
  })
  .catch(() => {
    console.log(`Connexion à MongoDB échouée`);
  });
