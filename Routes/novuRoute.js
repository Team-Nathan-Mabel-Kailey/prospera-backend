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
        const response = await novu.subscribers.list({ page, limit });
        allSubscribers = allSubscribers.concat(response.data);
        hasMore = response.hasMore;
        page++;
    }

    return allSubscribers;
}

async function triggerNotificationForAllUsers(workflowId, payload) {
    try {
        console.log('Fetching all subscribers...');
        const subscribers = await getAllSubscribers();
        console.log(`Total subscribers: ${subscribers.length}`);

        const triggerPromises = subscribers.map(subscriber => {
            console.log(`Triggering workflow for subscriber: ${subscriber.subscriberId}`);
            return novu.trigger(workflowId, {
                to: {
                    subscriberId: subscriber.subscriberId,
                    email: subscriber.email
                },
                payload: payload || {}
            });
        });

        await Promise.all(triggerPromises);
        console.log(`Notification triggered for ${subscribers.length} subscribers`);
    } catch (error) {
        console.error('Error triggering notifications:', error);
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