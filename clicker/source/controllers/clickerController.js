const clickerModel = require("../models/clicks.js");

exports.renderClicker = async (req, res) => {
  if (!req.user) return res.redirect('/login');

  let clicker = await clickerModel.findByUserId(req.user._id);

  if (!clicker) {
    clicker = await clickerModel.createForUser(req.user._id);
  }

  const lastUpdate = clicker.updatedAt || new Date();

  res.render("clicker", {
    user: req.user,
    clicks: clicker.clicks,
    lastUpdate: lastUpdate
  });
};

exports.incrementClick = async (req, res) => {
  const clicker = await clickerModel.increment(req.session.userId);
  res.json({ clicks: clicker.clicks || 0 });
};

exports.getState = async (req, res) => {
  const clicker = await clickerModel.getState(req.session.userId);
  res.json({ clicks: clicker?.clicks || 0 });
};
