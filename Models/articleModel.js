const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createArticle = async (title, content, source, url, publishedAt, type) => {
    return await prisma.article.create({
        data: { title, content, source, url, publishedAt, published: true, type },
    });
};

module.exports = {
    createArticle,
};
