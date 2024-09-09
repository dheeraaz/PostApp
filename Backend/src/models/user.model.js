import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    age:{
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    profilepic:{
        type: String, //cloudinary url
        default: "/images/default_profile.jpg"
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    isVerified:{
        type: Boolean,
        default: false
    },
    refreshtoken: {
        type: String,
    }
}, {timestamps:true})


// encrypting user's password just before saving the user's data in databse
userSchema.pre("save", async function(next){
    // encryption is done only if there is modification in user's password field
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {_id: this._id, username: this.username, email: this.email}, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {_id: this._id}, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

export const User = mongoose.model('User', userSchema)