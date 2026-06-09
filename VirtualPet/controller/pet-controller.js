const Pet = require('../models/Pet');

module.exports.getPet = async (req, res) => {
    const pet = await Pet.findOne({ owner: req.session.userId });
    if (!pet) {
        return res.redirect('/pet/create');
    }
    pet.applyTimePassage();
    await pet.save();
    res.render('pet', { pet });
}

module.exports.createPetForm = async (req, res) => {
    const existingPet = await Pet.findOne({ owner: req.session.userId });
    if (existingPet) {
        return res.redirect('/pet');
    }
    res.render('create-pet');
}

module.exports.createPet = async (req, res) => {
    try {
        const { name } = req.body;
        const existingPet = await Pet.findOne({ owner: req.session.userId });
        if (existingPet) {
            return res.redirect('/pet');
        }
        const pet = new Pet({ name, owner: req.session.userId });
        await pet.save();
        res.redirect('/pet');
    } catch (error) {
        res.render('create-pet', { error: 'Nie udało się stworzyć zwierzaka' });
    }
}

module.exports.feedPet = async (req, res) => {
    const pet = await Pet.findOne({ owner: req.session.userId });
    if (pet) {
        pet.feed();
        await pet.save();
    }
    res.redirect('/pet');
}

module.exports.playPet = async (req, res) => {
  const pet = await Pet.findOne({ owner: req.session.userId });
  if (pet) {
    pet.play();
    await pet.save();
  }
  res.redirect('/pet');
}

module.exports.sleepPet = async (req, res) => {
    const pet = await Pet.findOne({ owner: req.session.userId });
    if (pet) {
        pet.sleep();
        await pet.save();
    }
    res.redirect('/pet');
}