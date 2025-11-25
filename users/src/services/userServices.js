const {readUsers,writeUsers} = require('../models/storage.js');

function slugify(userName) {
  return userName
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function listUsers(){
    return await readUsers();
}
async function getUsersBySlug(slug){
    const users = await readUsers();
    return users.find(users => users.slug === slug);
}
async function createUser({userName,description}){
    const users = await readUsers();
    const slug = slugify(userName);

    let uniqueSlug = slug;
    let suffix = 1;
    while (users.some(user => user.slug === uniqueSlug)){
        uniqueSlug = `${slug}-${suffix++}`;
    }
    const newUser = {
        id: Date.now().toString(),
        userName,
        description,
        slug: uniqueSlug,
        createAt: new Date().toISOString()
    };
    users.unshift(newUser);
    await writeUsers(users);
    return newUser;
}

module.exports = {listUsers,getArticlesBySlug: getUsersBySlug,createUser}