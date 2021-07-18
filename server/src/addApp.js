const mongoose = require("mongoose");
const App = require("./models/App");
const { config } = require("dotenv");
const path = require("path");

config({
  path: path.join(__dirname, "./.env"),
});

async function run() {
  mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => console.log("Connected to MongoDB")
  );

  const app = App({
    name: "Couples.dk",
    clientId: "def",
    clientSecret: "456",
    redirectUrl: "http://localhost:5000/auth/login",
    fields: "displayName,email",
    url: "https://couples.dk"
  });

  await app.save();

  console.log("App added successfully");
  process.exit(0);
}

run();
