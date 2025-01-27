const jwt = require('jsonwebtoken');
const User = require('../model/userSchema.js');

const userAuth = async(req,res,next) =>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not found");
        }
        const decodedObj = await  jwt.verify(token, "Bh@vik5262");

        const {_id} = decodedObj;

        const loginUser = await User.findById(_id);
        if(!loginUser){
            throw new Error("User not found..!!");
        }

        req.user = loginUser;
        next();
    }catch(error){
        console.log(error);
    }
}

module.exports = {userAuth}