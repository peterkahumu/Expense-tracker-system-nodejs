const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const secret_key = 'secretkey';

exports.register = async (request, response) => {
    // create a new account
    const { fullname, username, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ fullname, username, password: hashedPassword });
        response.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }

};

exports.login = async (request, response) => {
    const { username, password } = request.body;

    try {
        // allow the user to login  without a token.

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return response.status(400).json({ error: "Invalid Username or Password" });

        } else {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return response.status(400).json({ error: "Invalid Username or Password" });
            } else {
                // generate token for the user
                const token = jwt.sign({ id: user.id }, secret_key, { expiresIn: '1h' });
                response.status(200).json({token: token });
            }
        }
    } catch (error) {
        response.status(500).json({ error: "Server Error" });
    }
};
