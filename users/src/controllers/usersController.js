const userService = require('../services/userServices');

async function index(req,res){
    const users = await userService.listUsers();
    res.render('users/list', {title: "Użytkownicy", users});
}

async function show(req,res){
    const slug = req.params.slug;
    const user = await userService.getUsersBySlug(slug);
    if(!user){
        return res.status(404).render('users/error', { 
          title: 'Błąd 404 – Użytkownik nie znaleziony', 
          error: 'Użytkownik nie znaleziony' 
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
        return res.status(400).render('users/new', {
            title: "nowy artykul",
            errors,
            user: {userName,description}
        });
    }
    const newUser = await userService.createUser({userName,description});
    res.status(300).redirect(`/users/${newUser.slug}`);
}
module.exports = {index,show,newForm,create};