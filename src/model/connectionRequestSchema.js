const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "intrested", "accepted", "rejected"],
            message: '{VALUE} is incorrect status types'
        }
    }
}, { timestamps: true });

connectionSchema.index({ fromUserId:1, toUserId: 1});

connectionSchema.pre('save', function (next) {
    const Request = this;
    // check if the fromUserId and toUserId are same
    if (Request.fromUserId.equals(Request.toUserId)) {
        throw new Error('Cannotn send request to itself');
    }
    next();
})

const Request = mongoose.model('Request', connectionSchema);

module.exports = Request;