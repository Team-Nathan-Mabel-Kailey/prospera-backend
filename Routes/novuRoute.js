const express = require('express');
const { serve } = require('@novu/framework/express');
const { hourlyHeadlinesWorkflow } = require('../novu/workflows');

const router = express.Router();

router.use(express.json()); // Required for Novu POST requests
router.use(serve({ workflows: [hourlyHeadlinesWorkflow] }));

router.post('/trigger-workflow', async (req, res) => {
    const { workflowId, subscriberId, payload } = req.body;

    if (!workflowId || !subscriberId) {
        return res.status(400).json({ error: 'Workflow ID and subscriber ID are required' });
    }

    try {
        await novu.trigger(workflowId, {
            to: {
                subscriberId: subscriberId,
            },
            payload: payload || {},
        });

        res.status(200).json({ message: 'Workflow triggered successfully' });
    } catch (error) {
        console.error('Error triggering workflow:', error);
        res.status(500).json({ error: 'Failed to trigger workflow' });
    }
});

router.post('/trigger-all', async (req, res) => {
    const { workflowId, payload } = req.body;

    if (!workflowId) {
    return res.status(400).json({ error: 'Workflow ID is required' });
    }

    try {
    await triggerNotificationForAllUsers(workflowId, payload);
    res.status(200).json({ message: 'Notifications triggered for all users' });
    } catch (error) {
    console.error('Error triggering notifications:', error);
    res.status(500).json({ error: 'Failed to trigger notifications' });
    }
});

module.exports = router;
