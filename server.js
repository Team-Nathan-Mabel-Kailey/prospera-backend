const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require("dotenv").config();
const { rateLimiter } = require('./utils/security');
const chatRoutes = require('./Routes/chatRoute');
const userRoutes = require("./Routes/authRoute");

const port = 3000;
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/api/chat', chatRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});