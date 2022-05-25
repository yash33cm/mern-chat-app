const jwt = require("jsonwebtoken");
const gentoken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};

module.exports = gentoken;
