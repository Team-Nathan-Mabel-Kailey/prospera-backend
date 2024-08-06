const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to get widgets by user ID
const getWidgetsByUserId = async (userId) => {
    return await prisma.widget.findMany({
        where: { userId: parseInt(userId) },
        select :
        {
            type: true,
            configuration: true,
        },
    });
};

// Function to update a widget's content by ID
const updateWidgetContent = async (id, configuration) => {
    return await prisma.widget.update({
        where: { id: parseInt(id) },
        data: {
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

// Function to get financial goals by user ID
const getFinancialGoalsByUserId = async (userId) => {
    return await prisma.widget.findMany({
        where: {
            userId: parseInt(userId),
            type: 'Financial Goals'
        },
        select: {
            id: true,
            configuration: true
        }
    });
};

module.exports = {
    getWidgetsByUserId,
    updateWidgetContent,
    deleteWidget,
    getFinancialGoalsByUserId
};
