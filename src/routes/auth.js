const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/userSchema.js');
const {validateData} = require('../utils/validateData.js');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        const { userName, email, password, skills,gender } = req.body;

        // Validate the Data
        validateData(req);

        // Save the hashed Password
        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userName: userName,
            email: email,
            password: hashPassword,
            skills: skills,
            gender: gender
        });
        await user.save();
        res.status(200).send("Successfully created ");
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const comoparepassword = await user.validatePassword(password);

        if (comoparepassword) {
            // create JWT token 
            const token = await user.getJwt();

            res.cookie("token", token);
            res.send("Login Successfully");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

authRouter.post('/logout', async (req, res) => {
    res
        .cookie('token', null, {
            expires: new Date(Date.now()),
        })
        .send("Logout successfully");
});

module.exports = { authRouter };
