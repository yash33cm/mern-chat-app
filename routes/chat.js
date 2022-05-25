const createHttpError = require("http-errors");
const auth = require("../mdiddleware/auth");
const User = require("../models/User");
const Chat = require("../models/Chat");
const router = require("express").Router();

router.post("/", auth, async (req, res, next) => {
  try {
    const { userid } = req.body;
    console.log(userid);
    if (!userid) throw createHttpError.UnprocessableEntity("no userid given");
    let chats = await Chat.find({
      isGroupchat: false,
      //and operation to select based on given condition***************************************************
      //unique way of finding useing elemmatch keyword*****************************
      $and: [
        { users: { $elemMatch: { $eq: userid } } },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestmessage");

    //the below sentence is the way to fetch the user information from the already populated
    //latestmessage field in chats model ,the users in latestmessage can be further populated using
    //below method very important technique
    chats = await User.populate(chats, {
      path: "latestmessage.sender",
      select: "name profilepic email",
    });
    // console.log(chats);
    if (chats.length > 0) {
      res.status(200).send(chats[0]);
    } else {
      const newChat = new Chat({
        chatName: "sender",
        users: [req.user._id, userid],
      });

      const confirm = await newChat.save();
      const createdchat = await Chat.findOne({ _id: confirm._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(createdchat);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestmessage")
      //we can sort in ascending by +1 and desc by -1
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestmessage.sender",
          select: "name profilepic email",
        });
        res.status(200).send(result);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
});

router.post("/group", auth, async (req, res, next) => {
  try {
    const name = req.body.name;
    let members = JSON.parse(req.body.members);
    if (!name) {
      throw createHttpError.UnprocessableEntity("Enter group/chat name");
    }
    if (members.length < 2)
      throw createHttpError.UnprocessableEntity("include atleast 2 in a group");
    members.push(req.user._id);
    const newgroup = new Chat({
      chatName: name,
      users: members,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    const savegrp = await newgroup.save();
    let result = await Chat.findOne({ _id: savegrp._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestmessage");
    result = await User.populate(result, {
      path: "lastestmessage.sender",
      select: "name profilepic email",
    });
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
});

router.put("/rename", auth, async (req, res, next) => {
  try {
    const { chatid, name } = req.body;
    const rename = await Chat.findByIdAndUpdate(
      chatid,
      {
        chatName: name,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!rename) {
      throw createHttpError.NotFound("no chat id found");
    } else {
      res.send(rename);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/add", auth, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

router.put("/remove", auth, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = router;
