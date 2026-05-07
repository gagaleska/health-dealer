const jwt = require("jsonwebtoken")

module.exports = (req, res) => {
    const authHeader = req.headers["authorization"]

    // if no auth header, return 401 -> user not logged in 
    if (!authHeader) return res.status(401).json({error: "No token provided - user is not logged in"})
        
    // extract token from header
    const token = authHeader.split(" ")[1] // Bearer <token>

    // if header exists but token is missing then invalid format
    if (!token) return res.status(401).json({error: "Invalid token format"})

    try{
        // verify token using secret key JWT_SECRET in .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRRET)
        
        // if token is valid, return decoded user info (id and email)
        req.user = decoded // attach decoded user info to request object for use in other routes
    } catch (err) {
        // if token is invalid or expired, return 401
        res.status(401).json({error: "Invalid or expired token"})
    }
}