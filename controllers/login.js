const connection = require('../connetion.js')
const bcrypt = require('bcrypt');

async function loginGet(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.sendFile("/loginpage");
    }
}
async function loginPost(req, res) {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [email], async (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 1) {
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (passwordMatch) {
                req.session.user = user;
                return res.redirect('/home');
            }
        }

        res.send('Invalid username or password');
    });
}


async function home(req, res) {
    if (req.session.user) {
        res.render('/home');
    } else {
        res.redirect('/login');
    }
}

async function logout (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
}

async function signupGet(req, res) {
    res.sendFile("/signupPage");
}
async function signupPost(req, res) {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    connection.query(sql, [email, hashedPassword], (error, results) => {
        if (error) {
            console.error('Error inserting user:', error);
            return res.status(500).send('Error registering user');
        }

        res.status(200).send('User registered successfully');
    });
}

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
module.exports = { loginPost , home, loginGet, logout, signupGet, signupPost, isAuthenticated };