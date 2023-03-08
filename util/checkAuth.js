const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../jwtConfig');

module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.token;
    if (authHeader) {
        // Bearer ....
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const tokenInfo = jwt.verify(token, SECRET_KEY);
                return tokenInfo;
            } catch (err) {
                throw new Error(err);
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
};
