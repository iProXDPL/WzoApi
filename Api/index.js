const express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const uri = process.env.db;
const app = express();
const PORT = 8080;

const client = new MongoClient(uri);
client.connect();
app.use(cors());
app.use(express.json());

app.post("/walki", async (req, res) => {
  if (req.body.itemy.length !== 0) {
    try {
      const database = client.db("walki");
      const test = database.collection("vsMob");
      var result = await test.insertOne(req.body);
      console.log(`Dodano walkę z itemem ${result.insertedId}`);
    } catch (error) {
      console.log(error);
    }
  }
  res.sendStatus(200);
});

app.get("/vsMob", async (req, res) => {
  try {
    const database = client.db("walki");
    const test = await database.collection("vsMob").find({}).toArray();
    res.json(test);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log("Server is Listening on Port ", PORT);
});
