const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateRegisterInput = require('../../util/validateRegisterInput');
const { SECRET_KEY } = require('../../jwtConfig');
const User = require('../../models/User');

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

            const res = await newUser.save();

            const token = jwt.sign(
                {
                    id: res.id,
                    email: res.email,
                    username: res.username,
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            return {
                ...res._doc,
                id: res._id,
                token,
            };
        },
    },
};
