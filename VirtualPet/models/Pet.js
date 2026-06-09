const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
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
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
});

petSchema.methods.applyTimePassage = function() {
  const now = new Date();
  const diffMs = now - this.lastUpdated;
  const diffTicks = Math.floor(diffMs / 10000); 

  if (diffTicks > 0) {
    this.hunger = Math.min(100, this.hunger + diffTicks);
    this.energy = Math.max(0, this.energy - diffTicks);
    this.happiness = Math.max(0, this.happiness - diffTicks);
    this.lastUpdated = now;
  }
};

petSchema.methods.feed = function() {
  this.hunger = Math.min(100, this.hunger + 20);
  this.happiness = Math.min(100, this.happiness + 5);
};

petSchema.methods.play = function() {
  this.energy = Math.max(0, this.energy - 15);
  this.happiness = Math.min(100, this.happiness + 15);
  this.hunger = Math.max(0, this.hunger - 5);
};

petSchema.methods.sleep = function() {
  this.energy = Math.min(100, this.energy + 25);
  this.happiness = Math.max(0, this.happiness - 5);
};

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;