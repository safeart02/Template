const session = require("express-session");
const mongoose = require("mongoose");
const mongodbsession = require("connect-mongodb-session")(session);

exports.initializemongodb = (app) => (mongoose.connect("mongodb://localhost:27017/Template").then((res)=>{
    console.log("Connected to MongoDB");
    const store = new mongodbsession({
        uri: "mongodb://localhost:27017/Template",
        collection: "enrollment_session",
    });
    app.use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    }));
}));
