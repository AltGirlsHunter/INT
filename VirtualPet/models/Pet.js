const mongoose = require('mongoose');

const clamp = (val) => Math.min(100, Math.max(0, val));

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hunger: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  happiness: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  energy: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

petSchema.methods.applyTimePassing = function () {
  this.hunger   = clamp(this.hunger   + 1);
  this.energy   = clamp(this.energy   - 1);
  this.happiness= clamp(this.happiness- 1);
};

petSchema.methods.getStatus = function () {
  const statuses = [];
  if (this.hunger === 100) statuses.push('bardzo głodny');
  if (this.energy === 0)   statuses.push('wyczerpany');
  return statuses;
};

module.exports = mongoose.model('Pet', petSchema);
