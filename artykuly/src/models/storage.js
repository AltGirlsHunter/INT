const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname,'..','..','data','articles.json');

async function readArticles() {
    const data = await fs.readFile(DATA_FILE,'utf-8');
    return JSON.parse(data || '[]');
}
async function writeArticles(articles) {
    await fs.writeFile(DATA_FILE, JSON.stringify(articles,null,4), 'utf-8');
}
module.exports = {readArticles,writeArticles};