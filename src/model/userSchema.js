const mongoose = require('mongoose');
const { isStrongPassword } = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validat(value) {
            if (!isEmail(value)) {
                throw new Error("Email is not valid" + value);
            }
        }
    },
    password: {
        type: String,
        validate(value) {
            if (!isStrongPassword(value)) {
                throw new Error("Password is not Strong" + value);
            }
        }
    },
    age: {
        type: String,
        min: 18,
        max: 50,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is Not Valid");
            }
        }
    },
    city: {
        type: String
    },
    skills: {
        type: [String]
    }
},{timestamps:true });

userSchema.methods.getJwt = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id},"Bh@vik5262");
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;