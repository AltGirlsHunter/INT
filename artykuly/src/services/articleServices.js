const {readArticles,writeArticles} = require('../models/storage.js');

function slugify(title) {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function listArticles(){
    return await readArticles();
}
async function getArticlesBySlug(slug){
    const articles = await readArticles();
    return articles.find(articles => articles.slug === slug);
}
async function createArticle({title,content,author}){
    const articles = await readArticles();
    const slug = slugify(title);

    let uniqueSlug = slug;
    let suffix = 1;
    while (articles.some(article => article.slug === uniqueSlug)){
        uniqueSlug = `${slug}-${suffix++}`;
    }
    const newArticle = {
        id: Date.now().toString(),
        title,
        content,
        author,
        slug: uniqueSlug,
        createAt: new Date().toISOString()
    };
    articles.unshift(newArticle);
    await writeArticles(articles);
    return newArticle;
}

module.exports = {listArticles,getArticlesBySlug,createArticle}