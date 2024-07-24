const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./Routes/authRoute");
const chatRoutes = require("./Routes/chatRoute");
const newsRoutes = require('./Routes/articleRoute');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from the backend");
});

// User routes
app.use("/users", userRoutes);

// Chat routes
app.use("/api/chat", chatRoutes);

//News routes
app.use('/api', newsRoutes);


app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});


