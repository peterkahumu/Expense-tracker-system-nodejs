const jwt = require("jsonwebtoken")
const secret_key = 'secretkey'

const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: "No token Provided" });
    }

    jwt.verify(token, secret_key, (error, decoded) => {
        if (error) {
            return response.status(403).json({ message: "Invalid token" });
        }

        request.userId = decoded.id;
        next();
    });
}

module.exports = authenticateToken