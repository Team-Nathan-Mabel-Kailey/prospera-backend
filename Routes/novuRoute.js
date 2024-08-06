const express = require('express'); // Import express for routing
require('dotenv').config(); // Load environment variables
const { Novu } = require('@novu/node'); // Import Novu for notifications

const novu = new Novu(process.env.NOVU_SECRET_KEY); // Initialize Novu with secret key
const router = express.Router(); // Create a new router

// Function to get all subscribers from Novu
async function getAllSubscribers() {
    try {
        console.log('Fetching all subscribers');
        let page = 0;
        const limit = 100;
        let allSubscribers = [];

        const response = await novu.subscribers.list(page, limit);

        allSubscribers = allSubscribers.concat(response);
        console.log(`Fetched page ${page + 1} with ${response.data.length} subscribers`);

        console.log(`Total subscribers fetched: ${allSubscribers.length}`);
        return allSubscribers;
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return [];
    }
}

// Function to trigger notifications for all users
async function triggerNotificationForAllUsers(workflowId, payload) {
    try {
        console.log(`Fetching all subscribers for workflow: ${workflowId}`);
        const subscribers = await getAllSubscribers();
        console.log(`Total subscribers: ${subscribers.length}`);

        const triggerPromises = subscribers.map(subscriber => 
            novu.trigger(workflowId, {
                to: {
                    subscriberId: subscriber.subscriberId
                },
                payload: payload || {}
            })
        );

        const results = await Promise.all(triggerPromises);

        console.log(`Triggered workflow for ${results.length} subscribers`);
        return results;
    } catch (error) {
        console.error('Error triggering notifications:', error);
        throw error;
    }
}

// Route to trigger workflow for all users
router.post('/trigger-workflow-all', async (req, res) => {
    console.log('Trigger all endpoint hit');
    const { workflowId, payload } = req.body;

    if (!workflowId) {
        return res.status(400).json({ error: 'Workflow ID is required' });
    }

    try {
        console.log(`Attempting to trigger workflow: ${workflowId}`);
        const results = await triggerNotificationForAllUsers(workflowId, payload);
        
        res.status(200).json({ 
            message: 'Workflow triggered for all users',
            triggeredCount: results.length
        });
    } catch (error) {
        console.error('Error triggering workflow for all users:', error);
        res.status(500).json({ 
            error: 'Failed to trigger workflow for all users', 
            details: error.message 
        });
    }
});

module.exports = router; // Export the router
