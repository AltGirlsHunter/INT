const Pet = require('../models/Pet');


async function render(req, res) {
     try {
    let pet = await Pet.findOne({ owner: req.session.userId });

    if (!pet) {
      return res.render('create-pet', { error: null });
    }

    pet.applyTimePassing();
    await pet.save();

    const statuses = pet.getStatus();
    res.render('pet', { pet, statuses });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
}

async function createPet(req, res) {
     const { name } = req.body;
  try {
    const existing = await Pet.findOne({ owner: req.session.userId });
    if (existing) return res.redirect('/pet');

    await Pet.create({ owner: req.session.userId, name });
    res.redirect('/pet');
  } catch (err) {
    console.error(err);
    res.render('create-pet', { error: 'Nie udało się stworzyć zwierzaka.' });
  }
}

async function feedPet(req, res) {
    try {
    const pet = await Pet.findOne({ owner: req.session.userId });
    if (!pet) return res.redirect('/pet');

    pet.hunger = Math.max(0, pet.hunger - 10);
    await pet.save();
    res.redirect('/pet');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
}

async function playWithPet(req, res) {
    try {
    const pet = await Pet.findOne({ owner: req.session.userId });
    if (!pet) return res.redirect('/pet');

    pet.happiness = Math.min(100, pet.happiness + 10);
    pet.energy    = Math.max(0,   pet.energy    - 5);
    await pet.save();
    res.redirect('/pet');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
}

async function makePetSleep(req, res) {
     try {
    const pet = await Pet.findOne({ owner: req.session.userId });
    if (!pet) return res.redirect('/pet');

    pet.energy = Math.min(100, pet.energy + 20);
    await pet.save();
    res.redirect('/pet');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
}

module.exports = {render, createPet, feedPet, playWithPet, makePetSleep}