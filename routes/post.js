const express= require('express')
const router= express.Router()
const mongoose= require('mongoose')
const Post= mongoose.model("Post")
const requireLogin= require('../middleware/requireLogin')



router.get('/allposts',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name ")
    .sort('-createdAt')
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{
        console.log(err)
    })
})


router.get('/followingsposts',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name ")
    .sort('-createdAt')
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic}= req.body

    if(! title || ! body || !pic){
        return res.status(422).json({error:"Please fill all the fields"})
    }

    req.user.password= undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save()
    .then(result=>{
        res.json({post:result , message:"Post created Successfully"})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/myposts',requireLogin,(req,res)=>{
        Post.find({postedBy:req.user._id})
        .populate("postedBy","_id name")
        .then(myposts=>{
            res.json({myposts})
        })
        .catch(err=>{
            console.log(err)
        })
})


router.put('/like',requireLogin, async(req,res)=>{
    try{
   const result = await Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec()

    res.json(result)
}
catch(err){
    console.log("Error", err)
}
})

router.put('/unlike',requireLogin, async(req,res)=>{

    try{
    const result= await Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec()

    res.json(result)
    }
    catch(err){
        console.log("Error", err)
    }
})

router.put('/comment',requireLogin,async (req,res)=>{
   console.log("bye")
    try{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    console.log(comment)
    console.log(req.body.postId)
   const result = await Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .exec()
   res.json(result)
}
catch(err){
    console.log("Error", err)
}
})


router.delete('/deletepost/:postId', requireLogin, async(req,res)=>{
   const result= await Post.findOneAndDelete({_id:req.params.postId})
      return res.json(result)
}) 



module.exports= router