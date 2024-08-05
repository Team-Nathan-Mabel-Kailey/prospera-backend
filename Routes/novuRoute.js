const express = require('express');
const { Novu } = require('@novu/node');
const { hourlyHeadlinesWorkflow } = require('../novu/workflows');

const router = express.Router();
const novu = new Novu(process.env.NOVU_SECRET_KEY);

router.use(express.json());

async function getAllSubscribers() {
    let allSubscribers = [];
    let page = 0;
    const limit = 100; // Adjust this based on Novu's API limits
    let hasMore = true;

    while (hasMore) {
        try {
            const response = await novu.subscribers.list({
                page,
                limit
            });
            
            if (response.data && Array.isArray(response.data.data)) {
                allSubscribers = allSubscribers.concat(response.data.data);
                hasMore = response.data.hasMore;
                page++;
            } else {
                console.error('Unexpected response structure:', response);
                hasMore = false;
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error.response?.data || error.message);
            hasMore = false;
        }
    }

    return allSubscribers;
}

async function triggerNotificationForAllUsers(workflowId, payload) {
    try {
        console.log('Fetching all subscribers...');
        const subscribers = await getAllSubscribers();
        console.log(`Total subscribers: ${subscribers.length}`);

        for (const subscriber of subscribers) {
            try {
                await novu.trigger(workflowId, {
                    to: {
                        subscriberId: subscriber.subscriberId,
                        email: subscriber.email
                    },
                    payload: payload || {}
                });
                console.log(`Triggered workflow for subscriber: ${subscriber.subscriberId}`);
            } catch (error) {
                console.error(`Error triggering workflow for subscriber ${subscriber.subscriberId}:`, error.response?.data || error.message);
            }
        }

        console.log(`Notification triggered for ${subscribers.length} subscribers`);
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
        await triggerNotificationForAllUsers(workflowId, payload);
        res.status(200).json({ message: 'Workflow triggered for all users successfully' });
    } catch (error) {
        console.error('Error triggering workflow for all users:', error);
        res.status(500).json({ error: 'Failed to trigger workflow for all users', details: error.message });
    }
});

module.exports = router;