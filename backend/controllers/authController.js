const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash the password properly
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Store hashed password
        });

        await newUser.save();

        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
// Login User

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid Password' });
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );


        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
        return res.status(200).json({
            message: "Login Successful",
            token,
            userId: user._id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Logout (handled by client clearing token)
const logoutUser = (req, res) => {
    // Optionally, you can blacklist the token (advanced use) or just send success
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logoutUser };
