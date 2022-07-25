const router=require("express").Router()
const createError=require("http-errors")
const auth=require("../mdiddleware/auth")
const Chat = require("../models/Chat")
const Message=require("../models/Messages")
const User=require("../models/User")
router.post("/",auth,async(req,res,next)=>{
    try {
        const {chatid,content}=req.body;
        if(!chatid||!content) {
            throw createError.NotFound("data is missing");
        }
        const message=new Message({
            sender:req.user._id,
            Content:content,
            chat:chatid
        })
        let msg=await message.save();
         msg=await msg.populate("sender","name profilepic")
         msg=await msg.populate("chat")
         msg=await User.populate(msg,{
             path:"chat.users",
             select:"name profilepic email"
         })
         await Chat.findByIdAndUpdate(req.body.chatid,{latestMessage:msg})
         res.status(201).json(msg)
    } catch (error) {
        next(error)
    }
})

router.get("/:chatid",auth,async(req,res,next)=>{
    try {
        console.log(req.params.chatid)
        let messages=await Message.find({chat:req.params.chatid}).populate("sender","name email profilepic").populate("chat")
        res.status(200).json(messages)
        
    } catch (error) {
        next(error)
    }
})



module.exports=router