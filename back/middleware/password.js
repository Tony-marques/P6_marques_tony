const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase(1)
  .has()
  .lowercase(1)
  .has()
  .digits(1)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    return res
      .status(401)
      .json({
        message:
          "le mot de passe est pas ok" +
          passwordSchema.validate("password", { list: true }),
      });
  } else {
    next();
  }
};
