const jwt = require("jsonwebtoken");

const userAutorization = function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Authorization denied. No token found." });
    }

    try {
        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = userAutorization;