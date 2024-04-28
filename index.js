const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// smaqwall
// I6KLNoSVPBGA40mh

app.use(cors());
app.use(express.json())





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://smaqwall:I6KLNoSVPBGA40mh@cluster0.hucmw0w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const userCollection = client.db("Ismaqw").collection("users");

    app.get('/users-my', async (req, res) => {
      const users = await userCollection.find({}).sort({ timestamp: -1 }).toArray();
      res.send(users); 
  });

  // POST a new user
  app.post('/users-my', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result); // Return the inserted user
  });

  // GET user by name
  app.get('/users-my/:name', async (req, res) => {
      const userName = req.params.name;
      const user = await userCollection.findOne({ name: userName });
      res.send(user); 
  });
  
  


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res) => {
    res.send('SMAQW is running')
})

app.listen(port, () => {
    console.log(`SmaqW is running by ${port}`);
})