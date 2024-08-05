const express = require('express');
const { Novu } = require('@novu/node');
require('dotenv').config();

const router = express.Router();
const novu = new Novu(process.env.NOVU_SECRET_KEY);

const ENVIRONMENT_ID = process.env.ENVIRONMENT_ID;
const APPLICATION_IDENTIFIER = process.env.APPLICATION_IDENTIFIER;

async function getAllSubscribers() {
    try {
        console.log('Fetching all subscribers');
        const response = await novu.subscribers.list({ environmentId: ENVIRONMENT_ID });

        if (!response.data || !Array.isArray(response.data)) {
            console.error('Unexpected response structure:', response);
            return [];
        }

        console.log(`Total subscribers fetched: ${response.data.length}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subscribers:', error.response?.data || error.message);
        return [];
    }
}

async function triggerNotificationForAllUsers(workflowId, payload) {
    try {
        console.log(`Fetching all subscribers for workflow: ${workflowId}`);
        const subscribers = await getAllSubscribers();
        console.log(`Total subscribers: ${subscribers.length}`);

        if (subscribers.length === 0) {
            console.log('No subscribers found. Skipping workflow trigger.');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const subscriber of subscribers) {
            try {
                await novu.trigger(workflowId, {
                    to: {
                        subscriberId: subscriber.subscriberId,
                        email: subscriber.email
                    },
                    payload: payload || {},
                    environmentId: ENVIRONMENT_ID,
                    applicationIdentifier: APPLICATION_IDENTIFIER
                });
                console.log(`Triggered workflow for subscriber: ${subscriber.subscriberId}`);
                successCount++;
            } catch (error) {
                console.error(`Error triggering workflow for subscriber ${subscriber.subscriberId}:`, error.response?.data || error.message);
                errorCount++;
            }
        }

        console.log(`Notification triggered successfully for ${successCount} subscribers`);
        console.log(`Failed to trigger notification for ${errorCount} subscribers`);
    } catch (error) {
        console.error('Error triggering notifications:', error.response?.data || error.message);
        throw error;
    }
}

router.post('/trigger-workflow-all', async (req, res) => {
    const { workflowId, payload } = req.body;
    console.log('Request received:', req.body);

    if (!workflowId) {
        return res.status(400).json({ error: 'Workflow ID is required' });
    }

    try {
        console.log(`Attempting to trigger workflow: ${workflowId}`);
        await triggerNotificationForAllUsers(workflowId, payload);
        res.status(200).json({ message: 'Workflow triggered for all users successfully' });
    } catch (error) {
        console.error('Error triggering workflow for all users:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to trigger workflow for all users', details: error.message });
    }
});

module.exports = router;