const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createArticle = async (title, content) => {
    return await prisma.article.create({
        data: { title, content, published: true },
    });
};

module.exports = {
    createArticle,
};

