const express = require('express');
const { serve } = require('@novu/framework/express');
const { hourlyHeadlinesWorkflow } = require('../novu/workflows');
const novu = require('../novu');

const router = express.Router();

router.use(express.json()); // Required for Novu POST requests


async function triggerNotificationForAllUsers(workflowId, payload) {
    try {
        console.log('hello');
        const data = await novu.subscribers.list();
        const subscribers = data.data.data;
        console.log(data)
        const triggerPromises = subscribers.map(subscriber => {
            console.log('subscriber is:', subscriber);
            console.log('triggering workflow ', workflowId)
            return novu.trigger(workflowId, {
                to: {
                    subscriberId: subscriber.subscriberId,
                    email: subscriber.email
                },
                payload: payload || {},
            })
            }
        );

        await Promise.all(triggerPromises);
        console.log(`Notification triggered for ${subscribers.length} users`);
    } catch (error) {
        console.error('Error triggering notifications:', error);
        throw error;
    }
}

router.post('/trigger-workflow-all', async (req, res) => {

    const { workflowId, payload } = req.body;
    console.log('request is:', req.body);

    if (!workflowId) {
        return res.status(400).json({ error: 'Workflow ID is required' });
    }

    try {
        await triggerNotificationForAllUsers(workflowId, payload);
        res.status(200).json({ message: 'Workflow triggered for all users successfully' });
    } catch (error) {
        console.error('Error triggering workflow for all users:', error);
        res.status(500).json({ error: 'Failed to trigger workflow for all users' });
    }
});

router.use('', serve({ workflows: [hourlyHeadlinesWorkflow] }));

module.exports = router;
