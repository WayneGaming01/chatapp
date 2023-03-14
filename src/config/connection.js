const mongoose = require("mongoose");
const config = require("./config.json");

module.exports = async () => {
  await mongoose.connect(config.MONGO_CLUSTER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  return mongoose;
};
mongoose.connection.on("connected", () => {
  console.log("✅ Connected to mongo!");
});
