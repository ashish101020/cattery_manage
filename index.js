const express = require('express');
const path = require('path');
const session = require('express-session');
const connection = require('./connetion.js');
const { loginGet, loginPost, home, logout, signupGet, signupPost, isAuthenticated } = require('./controllers/login.js');


const app = express();
const PORT = 5055;

app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));


app.use(express.urlencoded({extended: true, limit: "16kb"}));
connection.connect((error) => {
    if (error) {
        console.log('Database connection failed: ' + error.stack);
    }
    console.log('Connected to database as id ' + connection.threadId);
});

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set 'secure: true' if using HTTPS
}));


// Authentication route
app.get('/login', loginGet);
app.post('/login', loginPost);

// Middleware to check if the user is authenticated


// Home page route
app.get('/home', isAuthenticated,  home);

// Logout route
app.get('/logout', logout);

// Login page route


app.get('/signup', signupGet);
app.post('/signup', signupPost);

app.listen(PORT, () => {
    console.log(`port listen at ${PORT}`)
});