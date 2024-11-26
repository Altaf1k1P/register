import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
       type: String, 
    }
});

//for encrypt password

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});



userSchema.methods.generateAccessToken = async function(){
    return  jwt.sign({
          _id: this._id,
         email:  this.email
     },
     process.env.ACCESS_TOKEN_SECRET,
     {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
     }
 )
 }
  userSchema.methods.generateRefreshToken = async function(){
      return  jwt.sign({
         _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
 }

// Define the user model with the schema

export const User = mongoose.model('User', userSchema);