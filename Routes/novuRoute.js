const express = require('express');
const { serve } = require('@novu/framework/express');
const { hourlyHeadlinesWorkflow } = require('../novu/workflows');

const router = express.Router();

router.use(express.json()); // Required for Novu POST requests
router.use(serve({ workflows: [hourlyHeadlinesWorkflow] }));

router.post('/trigger-workflow-all', async (req, res) => {
    const { workflowId, payload } = req.body;

    if (!workflowId) {
        return res.status(400).json({ error: 'Workflow ID is required' });
    }

    try {
        const users = await getAllUsers();

        if (!users || users.length === 0) {
            return res.status(400).json({ error: 'No users found' });
        }

        const promises = users.map(user => {
            return novu.trigger(workflowId, {
                to: {
                    subscriberId: user.userID.toString(),
                    email: user.email,
                },
                payload: payload || {},
            });
        });

        await Promise.all(promises);

        res.status(200).json({ message: 'Workflow triggered for all users successfully' });
    } catch (error) {
        console.error('Error triggering workflow for all users:', error);
        res.status(500).json({ error: 'Failed to trigger workflow for all users' });
    }
});

module.exports = router;
