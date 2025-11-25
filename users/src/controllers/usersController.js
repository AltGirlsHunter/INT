const userService = require('../services/userServices');

async function index(req,res){
    const articles = await userService.listUsers();
    res.render('users/list', {title: "Użytkownicy", articles});
}

async function show(req,res){
    const slug = req.params.slug;
    const user = await userService.getUsersBySlug(slug);
    if(!user){
        return res.status(404).render('users/error', { 
          title: 'Błąd 404 – Artykuł nie znaleziony', 
          error: 'Artykuł nie znaleziony' 
        });
    
    }
        res.render('users/show', { title: user.userName, user });

}
async function newForm(req,res){
    res.render('users/new',{
        title:"Nowy użytkownik",
        errors: null,
        user: {}
    });
}
async function create(req,res){
    const {userName,description} = req.body;
    const errors = [];

    if(!title || description.trim().length < 3) errors.push("wymagany tytul");
    if(!description || description.trim().length < 10) errors.push("wymagana tresc");

    if(errors.length > 0) {
        return res.status(400).render('articles/new', {
            title: "nowy artykul",
            errors,
            article: {userName,description}
        });
    }
    const newArticle = await userService.createArticle({userName,description});
    res.status(300).redirect(`/articles/${newArticle.slug}`);
}
module.exports = {index,show,newForm,create};