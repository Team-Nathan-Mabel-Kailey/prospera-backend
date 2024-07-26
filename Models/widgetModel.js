const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Function to get widgets by user ID
const getWidgetsByUserId = async (userId) => {
    return await prisma.widget.findMany({
        where: { userId: parseInt(userId) }
    });
};
// Function to create a new widget
// const createWidget = async (userId, type, configuration, w, h, x, y, i) => {
//     return await prisma.widget.create({
//         data: {
//             user: {
//                 connect: { userID: parseInt(userId) },
//               },
//             type,
//             configuration,
//             w,
//             h,
//             x,
//             y,
//             i
//         }
//     });
// };


// Function to update a widget's layout by ID
// const updateWidgetLayout = async (id, w, h, x, y, i) => {
//     return await prisma.widget.update({
//         where: { id: parseInt(id) },
//         data: {
//             w,
//             h,
//             x,
//             y,
//             i
//         }
//     });
// };
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
module.exports = {
    getWidgetsByUserId,
    // createWidget,
    // updateWidgetLayout,
    updateWidgetContent,
    deleteWidget
};