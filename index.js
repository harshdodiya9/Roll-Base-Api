const express = require('express');
const port = 8001;
const app = express();

// Requires
const db = require('./config/mongoose');
const passport = require('passport');
const passportjwt = require("./config/passport_jwt_strategy");


const mongoose = require('mongoose')
mongoose.connect(("mongodb+srv://dodiyaharsh99:harsh123@cluster0.zqnwysw.mongodb.net/roll-Api"), {
     useUnifiedTopology: true,
     useNewUrlParser: true
 })
     .then(() => console.log('Database Connected'))
    .catch((err) => console.log(err));

// encoded the code
const session = require('express-session');
app.use(express.urlencoded());


app.use(session({
    name: 'adminJwt',
    secret: 'harsh',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 100
    }
}))

app.use(passport.initialize());
app.use(passport.session());


app.use('/admin', require('./routes/API/V1/Admin/admin'));
app.use('/user', require('./routes/API/V1/User/user'));

// Server connection
app.listen(port,(err)=>{
    if(err) console.log("Something wrong");
    console.log("Server connect on", port);
})