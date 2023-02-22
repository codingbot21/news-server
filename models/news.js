const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const newsSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    summary:{
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Newslist", newsSchema);