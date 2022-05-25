const router = require("express").Router();
const createError = require("http-errors");
const gentoken = require("../config/gentoken");
const User = require("../models/User");
const auth = require("../mdiddleware/auth");

router.post("/register", async (req, res, next) => {
  try {
    let { name, email, password, profilepic } = req.body;
    if (!name || !email || !password)
      throw createError.NotAcceptable("fill all fields");

    if (profilepic == "")
      profilepic =
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    const existuser = await User.findOne({ email });
    if (existuser) throw createError.UnprocessableEntity("user already exist");

    const user = new User({
      name,
      email,
      password,
      profilepic,
    });
    const validate = await user.save();
    if (validate) {
      res.status(201).json({
        _id: validate._id,
        name: validate.name,
        email: validate.email,
        isAdmin: validate.isAdmin,
        pic: validate.profilepic,
        token: gentoken(validate._id),
      });
    } else {
      throw createError.UnprocessableEntity("not proper entry");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createError.NotAcceptable("fill all fields");
    const existuser = await User.findOne({ email });
    if (existuser && (await existuser.hashedpass(password))) {
      res.status(201).json({
        id: existuser._id,
        name: existuser.name,
        email: existuser.email,
        isAdmin: existuser.isAdmin,
        pic: existuser.profilepic,
        token: gentoken(existuser._id),
      });
    } else {
      throw createError.NotFound("invalid credentials");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    //new function of mongodb or,regex ,options***************************************************
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    if (!keyword) throw createError.NotFound("no query found");
    //console.log(req.user._id);

    // how to fetch details except a particular id in mongodb *************************************
    const user = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(user);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
