const express = require('express');
const { userAuth } = require('../middleware/Auth');
const Request = require('../model/connectionRequestSchema.js');
const User = require('../model/userSchema.js');

const connectionRouter = express.Router();

connectionRouter.post('/request/send/:type/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.type;

        const Allowed_status = ["intrested", "ignored"];

        if (!Allowed_status.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type"
            })
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        
        const existingConnectionRequest = await Request.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });

        if(existingConnectionRequest){
            return res.status(400).json({
                message: "Connection request already exist"
            })
        }

        const connectionRequest = new Request({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.status(200).json({
            message: "Connection request send Succssfully",
            data
        })
        
    } catch (error) {
        console.log(error);
    }
});

connectionRouter.post('/request/review/:status/:requestId',userAuth, async (req,res) =>{
    try {
        const loginUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted","rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type"
            })
        }

        const connectionRequest = await Request.findOne({
            _id:requestId,
            toUserId: loginUser._id,
            status:"intrested"
        });

        if(!connectionRequest){
            return res.status(400).json({
                message:"Invalid connection request"
            })
        }
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.status(200).json({
            message:"Connection request" + status,
            data
        });

    } catch (error) {
        console.log(error);
    }
})
module.exports = { connectionRouter };