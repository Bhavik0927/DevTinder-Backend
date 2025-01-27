const express = require('express');
const connectDB = require('./src/Database/db.js');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

const {authRouter} = require("./src/routes/auth.js");
const {profileRouter} = require('./src/routes/profile.js');
const {connectionRouter} = require('./src/routes/connection.js');
const {userRouter} = require('./src/routes/user.js');

app.use("/",authRouter);
app.use('/',profileRouter);
app.use('/',connectionRouter);
app.use('/',userRouter); 


app.get('/', (req, res) => {
    res.send("Heel")
});


connectDB();

app.listen(4000, (error) => {
    if (!error) {
        console.log(`Server is Connected to ${4000}`)
    } else {
        console.log("Something is missing or undefined");
    }
})