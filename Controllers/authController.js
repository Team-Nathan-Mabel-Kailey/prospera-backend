const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByUsername } = require("../Models/authModel");

// Register User
const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password using bcrypt and salt factor 10
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save the user model with the hashed password
        const user = await createUser(username, hashedPassword);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: "User register error, maybe the user exists" });
    }
};

// Login User
// user exists?
// password correct?
const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
        // Create a JSON Web Token
        const token = jwt.sign(
        { userId: user.userID, userName: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: "Invalid Credentials" });
    }
};

module.exports = { register, login };
