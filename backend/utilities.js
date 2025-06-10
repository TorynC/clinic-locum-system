const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.token || tokenFromHeader;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.email = user.email;
        next();
    });

}

module.exports = { authenticateToken };
