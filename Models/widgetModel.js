const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to get widgets by user ID
const getWidgetsByUserId = async (userId) => {
    return await prisma.widget.findMany({
        where: { userId: parseInt(userId) }
    });
};

// Function to create a new widget
const createWidget = async (userId, type, configuration) => {
    return await prisma.widget.create({
        data: {
            userId: parseInt(userId),
            type,
            configuration
        }
    });
};

// Function to delete a widget by ID
const deleteWidget = async (id) => {
    return await prisma.widget.delete({
        where: { id: parseInt(id) }
    });
};

module.exports = {
    getWidgetsByUserId,
    createWidget,
    deleteWidget
};
