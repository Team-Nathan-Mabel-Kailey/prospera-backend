const express = require('express');
const { serve } = require('@novu/framework/express');
const { hourlyHeadlinesWorkflow } = require('../novu/workflows');

const router = express.Router();

router.use(express.json()); // Required for Novu POST requests
router.use(serve({ workflows: [hourlyHeadlinesWorkflow] }));

async function triggerNotificationForAllUsers(workflowId, payload) {
    try {
        const { data: subscribers } = await novu.subscribers.list();
        
        const triggerPromises = subscribers.map(subscriber => 
            novu.trigger(workflowId, {
                to: {
                    subscriberId: subscriber.subscriberId,
                },
                payload: payload,
            })
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

module.exports = router;
