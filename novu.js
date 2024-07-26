require('dotenv').config();
const { Novu } = require('@novu/node');

const novu = new Novu(process.env.NOVU_SECRET_KEY);

module.exports = novu;
