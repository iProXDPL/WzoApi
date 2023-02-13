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

app.post("/addvsMob", async (req, res) => {
  try {
    if (req.body.Startat !== undefined) {
      const database = client.db("walki");
      const test = database.collection("vsMob");
      const el = await test.find({ Startat: req.body.Startat }).toArray();
      if (el.length == 0) {
        const result = await test.insertOne(req.body);
        console.log(`Dodano walkę z itemem ${result.insertedId}`);
      } else {
        console.log("Istnieje już taka walka z mobem");
      }
    }
  } catch (error) {
    console.log(error);
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

app.post("/updatevsMob", async (req, res) => {
  try {
    res.sendStatus(200);
    if (req.body.Startat !== undefined) {
      const database = client.db("walki");
      const test = await database
        .collection("vsMob")
        .updateOne(
          { ev: parseFloat(req.body.Startat) },
          { $set: { kto: req.body.kto } }
        );
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/addvsPlayer", async (req, res) => {
  try {
    if (req.body.Startat !== undefined) {
      const database = client.db("walki");
      const test = database.collection("vsPlayer");
      const el = await test.find({ Startat: req.body.Startat }).toArray();
      if (el.length == 0) {
        var result = await test.insertOne(req.body);
        console.log(`Walkę z graczem ${result.insertedId}`);
      } else {
        test.updateOne({ Startat: req.body.Startat }, { $set: req.body });
        console.log("Update walka");
      }
    }
  } catch (error) {
    console.log(error);
  }
  res.sendStatus(200);
});

app.get("/vsPlayer", async (req, res) => {
  try {
    const database = client.db("walki");
    const test = await database.collection("vsPlayer").find({}).toArray();
    res.json(test);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log("Server is Listening on Port ", PORT);
});
