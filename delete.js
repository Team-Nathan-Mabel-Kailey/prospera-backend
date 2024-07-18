const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Delete all related records in the correct order
    await prisma.chatbotInteraction.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('All chatbot interactions, conversations, articles, and users deleted');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
