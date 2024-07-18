const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    createUser,
    findUserByUsername,
    findUserByEmail,
} = require("../Models/authModel");

// Register User
const register = async (req, res) => {
    const { username, email, password, securityAnswer } = req.body;

    try {
        // Check if username already exists
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(username, email, hashedPassword, securityAnswer);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: "User register error" });
    }
};

// Login User
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (user && (await bcrypt.compare(password, user.password))) {
        // Create a JSON web token
        const token = jwt.sign(
            { userId: user.userID, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );
        res.status(200).json({ token });
        } else {
        res.status(401).json({ error: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: "Login error" });
    }
};

module.exports = { register, login };
