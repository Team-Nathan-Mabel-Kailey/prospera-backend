const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const novu = require('../novu');
const {
    createUser,
    findUserByUsername,
    findUserByEmail,
    updateUserPasswordByUsername,
    updateUserTopics,
    getUserById
} = require("../Models/authModel");

// Register User
const register = async (req, res) => {
    const { username, email, password, securityAnswer } = req.body;

    try {
        console.log("Register request body:", req.body);

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            console.log("Username already exists:", username);
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            console.log("Email already exists:", email);
            return res.status(400).json({ error: "Email already exists" });
        }

        if (!username || !email || !password || !securityAnswer) {
            console.log("Missing required fields:", req.body);
            return res.status(400).json({ error: "Missing required fields" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);
        const user = await createUser(username, email, hashedPassword, hashedSecurityAnswer);

        // Create a Novu subscriber for the new user
        await novu.subscribers.identify(user.userID.toString(), {
            email: user.email,
            firstName: user.username, // Adjusted as `firstName` is not in the user model
            avatar: null, // Assuming avatar is not part of the user model
        });

        console.log("User created:", user);

        res.status(201).json(user);
    } catch (error) {
        console.error("User register error:", error);
        res.status(500).json({ error: "User register error" });
    }
};

// Login User
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { userId: user.userID, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.status(200).json({ 
                token, 
                userId: user.userID, 
                hasCompletedTopics: user.hasCompletedTopics 
            });
        } else {
            res.status(401).json({ error: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: "Login error" });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    const { username, newPassword, securityAnswer } = req.body;

    try {
        console.log("Request body:", req.body);

        if (!username || !newPassword || !securityAnswer) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if security answer matches
        if (!(await bcrypt.compare(securityAnswer, user.securityAnswer))) {
            return res.status(400).json({ error: "Incorrect security answer" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPasswordByUsername(username, hashedPassword);

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ error: "Password reset error", details: error.message });
    }
};

// Save user topics
const saveTopics = async (req, res) => {
    const { userId, topics } = req.body;

    console.log("Received request to save topics:", { userId, topics });

    try {
        const user = await updateUserTopics(userId, topics);
        console.log("User topics updated successfully:", user);
        res.status(200).json({ message: "Topics saved successfully", user });
    } catch (error) {
        console.error("Failed to save topics:", error);
        res.status(500).json({ error: "Failed to save topics", details: error.message });
    }
};

const getTopics = async (req, res) => {
    const { userId } = req.params;

    console.log("Received request to get topics for user:", userId);

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User found:", user);
        res.status(200).json({ topics: user.topics, hasCompletedTopics: user.hasCompletedTopics });
    } catch (error) {
        console.error("Failed to retrieve topics:", error);
        res.status(500).json({ error: "Failed to retrieve topics" });
    }
};

const getUser = async (req, res) => {
    const { userId } = req.params;
    try {
    const user = await getUserById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
    } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
    }
};

module.exports = { register, login, forgotPassword, saveTopics, getTopics, getUser };
