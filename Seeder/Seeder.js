const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("../Models/User");
const Category = require("../Models/Category");
const Transactions = require("../Models/Transactions");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Transactions.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
}
