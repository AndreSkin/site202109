const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const passport = require("./passport_local_strategy.js");
const auth = require("./auth.js");

const app = express();
const PORT = 8000;
const MONGO_URI = "mongodb://localhost:27017/localtest"

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true })
    .then(console.log(`MongoDB connected ${MONGO_URI}`))
    .catch(err => console.log(err));

// Bodyparser middleware, extended false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

try{
// Express Session
app.use(
    session({
        secret: "very secret this is",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: MONGO_URI }),
    })
);
}
catch(error)
{
    console.log("ERRORE: ", error)
}
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", auth);
app.get("/", (req, res) => res.send("Good monring sunshine!"));

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}!`));