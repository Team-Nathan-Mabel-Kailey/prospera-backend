
require('ts-node').register();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./Routes/authRoute');
const chatRoutes = require('./Routes/chatRoute');
const widgetRoutes = require('./Routes/widgetRoute');
const settingsRoutes = require('./Routes/settingsRoute');
const novuRoutes = require('./Routes/novuRoute');
const cron = require('node-cron');
const { Novu } = require('@novu/node');
const novu = new Novu(process.env.NOVU_SECRET_KEY);
const { Pool } = require('pg');
const authMiddleware = require('./Middleware/authMiddleware');
import { serve } from "@novu/framework/express";
import { hourlyHeadlinesWorkflow } from './novu/workflows';

require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use( "/api/novu", serve({ workflows: [hourly-headlines] }) );

// Routes
app.use('/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/novu', novuRoutes);

// Schedule a cron job to trigger the workflow every hour
cron.schedule('0 * * * *', async () => {
    try {
        const { data } = await novu.subscribers.list();
        const subscribers = data.data;

        if (!Array.isArray(subscribers)) {
            console.error('Subscribers is not an array:', subscribers);
            return;
        }

        for (const subscriber of subscribers) {
            try {
                await novu.trigger('hourly-headlines', {
                    to: {
                        subscriberId: subscriber.subscriberId,
                    },
                    payload: {},
                });
                console.log(`Triggered workflow for subscriber: ${subscriber.subscriberId}`);
            } catch (error) {
                console.error(`Error triggering workflow for subscriber ${subscriber.subscriberId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error fetching subscribers or triggering workflow:', error);
    }
});

// Endpoint to identify or create a subscriber
app.get('/api/getSubscriber', authMiddleware, async (req, res) => {
    const user = req.user;

    try {
        const subscriber = await novu.subscribers.identify(user.id, {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatar: user.avatar,
            locale: user.locale,
            data: { customKey1: 'customVal1', customKey2: 'customVal2' },
        });

        res.json({ subscriberId: subscriber.id });
    } catch (error) {
        console.error('Error identifying/creating subscriber:', error);
        res.status(500).json({ error: 'Failed to identify or create subscriber' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});


