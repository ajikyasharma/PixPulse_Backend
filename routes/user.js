const express= require('express')
const router= express.Router()
const mongoose= require('mongoose')
const Post= mongoose.model("Post")
const User= mongoose.model("User")
const requireLogin= require('../middleware/requireLogin')


router.get('/user/:id',requireLogin, async(req,res)=>{
      try{
        const user= await User.findOne({_id: req.params.id})
        const posts = await Post.find({postedBy:req.params.id})

        res.json({user, posts})
      }
      catch(error){
        console.log("Error",error)
      }
})

router.get('/searchuser/:id',requireLogin, async(req,res)=>{
  try{
    const user= await User.find({"email": req.params.id})
    res.json(user)
  }
  catch(error){
    console.log("Error",error)
  }
})


router.put('/follow',requireLogin, async (req,res)=>{
    try{
         const result1= await User.findByIdAndUpdate(req.body.followId,{
              $push:{followers:req.user._id}
         },{
            new:true
         }).exec()

         const result2 =await User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
         },{
           new:true
         }).exec()

         res.json({result1, result2})
    }
    catch(error){
      console.log("Error", err)
    }
})

router.put('/unfollow',requireLogin, async (req,res)=>{
  try{
       const result1= await User.findByIdAndUpdate(req.body.followId,{
            $pull:{followers:req.user._id}
       },{
          new:true
       }).exec()

       const result2 =await User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.followId}
       },{
         new:true
       }).exec()

       res.json({result1, result2})
  }
  catch(error){
    console.log("Error", err)
  }
})

router.put('/updateimage',requireLogin, async(req,res)=>{
     try{
      const result= await User.findOneAndUpdate(req.user._id,{$set:{image:req.body.pic}},{new:true})
       res.json(result)
     }
     catch(error){
      console.log("Error",error)
     }
})


module.exports= router