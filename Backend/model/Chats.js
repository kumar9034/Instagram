const mongoose = require("mongoose")

const chatschema = new mongoose.Schema({

    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: {
        type: String
    } ,
    read: { type: Boolean, default: false }
}, {timestamps: true})

module.exports = mongoose.model("Chat", chatschema)