const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

function collection() {
  return getDB().collection("clickers");
}

async function findByUserId(userId) {
  return await collection().findOne({
    userId: new ObjectId(userId)
  });
}

async function createForUser(userId) {
  const doc = {
    userId: new ObjectId(userId),
    clicks: 0,
    updatedAt: new Date()
  };

  await collection().insertOne(doc);
  return doc;
}

async function increment(userId) {
  const filter = { userId: new ObjectId(userId) };
  const update = { $inc: { clicks: 1 }, $set: { updatedAt: new Date() } };
  const options = { returnDocument: "after", upsert: true };

  let result = await collection().findOneAndUpdate(filter, update, options);

  if (!result.value) {
    await collection().updateOne(filter, { $setOnInsert: { clicks: 1, updatedAt: new Date() } }, { upsert: true });
    result = await collection().findOne(filter);
  }

  return result;
}

async function getState(userId) {
  return await collection().findOne({ userId: new ObjectId(userId) });
}

module.exports = {
  findByUserId,
  createForUser,
  increment,
  getState
};