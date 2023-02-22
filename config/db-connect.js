require("dotenv").config();
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

// connection to mongodb database
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err => {
            if (err) {
                console.log("Connection to database failed ")
                console.log(err)
            }
        }))
        console.log("Connection to database success")

    } catch (error) {
        console.log("Error")
    }
}

module.exports = connectDb;
