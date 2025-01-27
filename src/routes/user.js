const express = require('express');
const userRouter = express.Router();
const { userAuth } = require("../middleware/Auth.js");
const Request = require("../model/connectionRequestSchema.js");
const User = require('../model/userSchema.js');

const USER_SAFE_DATA = "userName email gender skills";

// Get all the Pending connection Request for the logIn user.
userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loginUser = req.user;
        const connectionRequest = await Request.find({
            toUserId: loginUser._id,
            status: "intrested"
        }).populate("fromUserId", ["userName", "gender", "skills"]);

        res.json({
            message: "Data fetched Successfully",
            data: connectionRequest
        })
    } catch (error) {
        console.log(error);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loginUser = req.user;
        const connectionRequest = await Request.find({
            $or: [
                { toUserId: loginUser._id, status: "accepted" },
                { fromUserId: loginUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["userName", "gender", "skills"]).populate("toUserId", ["userName", "gender", "skills"]);

        const data = connectionRequest.map(row => {
            if (row.fromUserId._id.toString() === loginUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({
            message: "Data fetched Successfully",
            data
        });

    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            error: error.message
        })
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loginUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequest = await Request.find({
            $or: [
                { toUSerId: loginUser._id },
                { fromUserId: loginUser._id }
            ]
        }).select("fromUserId toUserId ");

        const hideUserFromFeed = new Set();

        connectionRequest.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })

        const Users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loginUser._id } }
            ]
        }).select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);


        res.json({ data: Users });

    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})

module.exports = { userRouter };