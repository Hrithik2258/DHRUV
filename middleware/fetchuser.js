var jwt = require('jsonwebtoken');
const JWT_SECRET = 'passwors$password'


const fetchuser = (req, res, next) => {

    // get the user auth token 

    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using the valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using the valid token" })

    }
}

module.exports = fetchuser;