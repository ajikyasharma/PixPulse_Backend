const mongoose= require('mongoose')
const {ObjectId}= mongoose.Schema.Types

const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requires:true
    },
    password:{
        type:String,
        equired:true 
    },
    image:{
      type:String,
      default:"https://imgs.search.brave.com/WzsJxrd95PAh6aWhwpATikTtTAnHJl_xX00Luqxvp_U/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzQwLzEyLzQ5/LzM2MF9GXzM0MDEy/NDkzNF9iejNwUVRM/cmRGcEg5MmVra251/YVRIeThKdVhnRzdm/aS5qcGc"
    },
    followers:[{type:ObjectId, ref:"User"}],
    following:[{type:ObjectId, ref:"User"}]
})

mongoose.model("User",userSchema)