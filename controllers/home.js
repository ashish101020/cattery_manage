const connection = require('../connetion.js')


async function home(req, res) {
    if (req.session.user) {
        res.render('/home');
    } else {
        res.redirect('/login');
    }
}

module.exports = { home }