const connection = require('../connetion.js')
const bcrypt = require('bcrypt');

async function loginGet(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('login');
    }
}
async function loginPost(req, res) {
    const { username, password } = req.body;

    // Check for missing email or password
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [username], async (error, results) => {
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

        res.status(401).send('Invalid email or password');
    });
}



async function home(req, res) {
    if (req.session.user) {
        res.render('/home');
    } else {
        res.redirect('/login');
    }
}

async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/login');
    });
}

async function signupGet(req, res) {
    res.render('signup'); // Assuming 'signupPage.ejs' is your signup page template
}

async function signupPost(req, res) {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        connection.query(sql, [username, hashedPassword], (error, results) => {
            if (error) {
                console.error('Error inserting user:', error);
                return res.status(500).send('Error registering user');
            }

            // Redirect back to the previous page (HTTP referer)
            const previousPage = req.header('Referer') || '/'; // If referer not available, redirect to root
            res.redirect(previousPage);
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Internal Server Error');
    }
}


function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
module.exports = { loginPost , home, loginGet, logout, signupGet, signupPost, isAuthenticated };