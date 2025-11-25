const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname,'..','..','data','users.json');

async function readUsers() {
    const data = await fs.readFile(DATA_FILE,'utf-8');
    return JSON.parse(data || '[]');
}
async function writeUsers(users) {
    await fs.writeFile(DATA_FILE, JSON.stringify(users,null,4), 'utf-8');
}
module.exports = {readUsers,writeUsers};