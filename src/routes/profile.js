const express = require('express');
const { userAuth } = require('../middleware/Auth.js');
const { validateEditProfileData } = require('../utils/validateData.js');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const loginUser = req.user;
        if (!loginUser) {
            throw new Error("User does not exist");
        }

        res.send(loginUser);

    } catch (error) {
        console.log(error.message);
    }
})


profileRouter.patch('profile/edit', async (req, res) => {
    try {
        if (!validateEditProfileData) {
            throw new Error("Invalid edit requests");
        }
        const loginUser = req.user;

        Object.keys(req.body).forEach((key) => (loginUser[key] = req.body[key]));

        await loginUser.save();
        res.json({
            message: `${loginUser.userName} your Profile updated successfully`,
            data: loginUser
        });
    } catch (error) {
        console.log(error);
    }
})


profileRouter.post('/profile/password', async (req, res) => {
    try {
        const { token } = req.cookies;
        console.log(token);
        if (!token) {
            throw new Error("Login first");
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = { profileRouter };