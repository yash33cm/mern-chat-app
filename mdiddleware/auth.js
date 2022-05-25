const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTVkZDFjYjExMzAyYTQ2NDJkOWE4NyIsImlhdCI6MTY0NTczNDU1OCwiZXhwIjoxNjQ4MzI2NTU4fQ.H5A0TCFs2Fi29COXwkVoLn8eW6Uo9uFZ7Mx7uPeopkM
//yash33cm@gmail.com

const auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const verify = jwt.verify(token, process.env.SECRET_KEY);
      if (!verify) {
        throw createHttpError.Unauthorized("Not Valid session token");
      }

      //learnt how to select a specific fields from the db or reject from db***********************************
      //in below case rejecting password field
      req.user = await User.findById(verify.id).select("-password");
      //console.log(req.user._id);

      next();
    } else {
      throw createHttpError.Unauthorized("Not Valid session token");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
