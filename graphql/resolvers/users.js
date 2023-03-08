const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateLoginInput = require('../../util/validateLoginInput');
const validateRegisterInput = require('../../util/validateRegisterInput');
const { SECRET_KEY } = require('../../jwtConfig');
const User = require('../../models/User');

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: User.username,
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
}

module.exports = {
    Query: {
        async getUsers() {
            try {
                const users = await User.find();
                return users;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            // Validate user data

            let { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);

            errors = Object.values(errors).filter((n) => n !== undefined);

            console.log(errors);
            if (!valid) {
                throw new Error(`${errors}`, errors);
            }

            // Make sure user doesn't already exist
            const user = await User.findOne({ username });

            if (user) {
                throw new Error('Username is taken', {
                    errors: {
                        username: 'This username is taken',
                    },
                });
            }

            // Hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            });

            const result = await newUser.save();

            const token = generateToken(result);
            return {
                ...result._doc,
                id: result._id,
                token,
            };
        },
        async login(_, { username, password }) {
            let { valid, errors } = validateLoginInput(username, password);

            errors = Object.values(errors).filter((n) => n !== undefined);

            console.log(errors);
            if (!valid) {
                throw new Error(`${errors}`, errors);
            }
            const user = await User.findOne({ username });

            if (!user) {
                errors.general = 'User not found';
                throw new Error(errors.general, errors);
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials';
                throw new Error(errors.general, errors);
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token,
            };
        },
    },
};
