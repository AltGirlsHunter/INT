const articleService = require('../services/articleServices');

async function index(req,res){
    const articles = await articleService.listArticles();
    res.render('articles/list', {title: "Artykuły", articles});
}

async function show(req,res){
    const slug = req.params.slug;
    const article = await articleService.getArticlesBySlug(slug);
    if(!article){
        return res.status(404).render('articles/error', { 
          title: 'Błąd 404 – Artykuł nie znaleziony', 
          error: 'Artykuł nie znaleziony' 
        });
    
    }
        res.render('articles/show', { title: article.title, article });

}
async function newForm(req,res){
    res.render('articles/new',{
        title:"Nowy artykul",
        errors: null,
        article: {}
    });
}
async function create(req,res){
    const {title,content,author} = req.body;
    const errors = [];

    if(!title || content.trim().length < 3) errors.push("wymagany tytul");
    if(!content || content.trim().length < 10) errors.push("wymagana tresc");

    if(errors.length > 0) {
        return res.status(400).render('articles/new', {
            title: "nowy artykul",
            errors,
            article: {title,content,author}
        });
    }
    const newArticle = await articleService.createArticle({title,content,author});
    res.status(300).redirect(`/articles/${newArticle.slug}`);
}
module.exports = {index,show,newForm,create};