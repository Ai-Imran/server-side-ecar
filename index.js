const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// smaqwall
// I6KLNoSVPBGA40mh

app.use(cors());
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const orderCollection = client.db("Ismaqw").collection("orders");
    const problemsCollection = client.db("Ismaqw").collection("problems");
    const userPostCollection = client.db("Ismaqw").collection("posts");
    const TotalRevenueCollection = client.db("Ismaqw").collection("revenue");

    //  const verifyToken = (req, res, next) => {
    //   // console.log('inside verify token', req.headers.authorization);
    //   if (!req.headers.authorization) {
    //     return res.status(401).send({ message: 'unauthorized access' });
    //   }
    //   const token = req.headers.authorization.split(' ')[1];
    //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //     if (err) {
    //       return res.status(401).send({ message: 'unauthorized access' })
    //     }
    //     req.decoded = decoded;
    //     next();
    //   })
    // }

    // // use verify admin after verifyToken
    // const verifyAdmin = async (req, res, next) => {
    //   const email = req.decoded.email;
    //   const query = { email: email };
    //   const user = await userCollection.findOne(query);
    //   const isAdmin = user?.role === 'admin';
    //   if (!isAdmin) {
    //     return res.status(403).send({ message: 'forbidden access' });
    //   }
    //   next();
    // }

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

  app.patch('/users-my/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { role } = req.body; // Extract role from request body
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
            $set: {
                role: role // Set role based on request body
            }
        };

        const result = await userCollection.updateOne(filter, updatedDoc);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'User not found or role unchanged' });
        }

        res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  app.delete('/users-my/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await userCollection.deleteOne(query);
    res.send(result);
  })

  // order related 
  app.get('/users-orders', async (req, res) => {
    const orders = await orderCollection.find({}).sort({ timestamp: -1 }).toArray();
    res.send(orders); 
});


app.post('/users-orders', async (req, res) => {
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.send(result); // Return the inserted user
});

// Add this code after the existing routes

// GET orders by phone number
app.get('/users-orders/:phoneNumber', async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const orders = await orderCollection.find({ phoneNumber }).sort({ timestamp: -1 }).toArray();
  res.send(orders); 
});

// DELETE an order by ID
app.delete('/users-orders/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await orderCollection.deleteOne(query);
  res.send(result);
});

  
  // problems related 
  app.get('/users-problems', async (req, res) => {
    const orders = await problemsCollection.find({}).sort({ timestamp: -1 }).toArray();
    res.send(orders); 
});

app.post('/users-problems', async (req, res) => {
    const order = req.body;
    const result = await problemsCollection.insertOne(order);
    res.send(result); // Return the inserted user
});

app.get('/users-problems', async (req, res) => {
  const { name } = req.query;
  let query = {};
  if (name) {
      query = { name: { $regex: name, $options: 'i' } }; // Case-insensitive search
  }
  const problems = await problemsCollection.find(query).sort({ timestamp: -1 }).toArray();
  res.send(problems);
});

// Delete a problem by ID
app.delete('/users-problems/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await problemsCollection.deleteOne(query);
  res.send(result);
});
// user post get
    app.get('/all-user-post', async (req, res) => {
      const users = await userPostCollection.find({}).sort({ timestamp: -1 }).toArray();
      res.send(users); 
  });

  //   user POST
  app.post('/all-user-post', async (req, res) => {
      const newUser = req.body;
      const result = await userPostCollection.insertOne(newUser);
      res.send(result); // Return the inserted user
  });
  
  // Search user posts by name
// Modify the endpoint to handle both searching and fetching all posts
app.get('/all-user-posts', async (req, res) => {
  const { name } = req.query;
  let query = {};
  if (name) {
      query = { userName: { $regex: name, $options: 'i' } }; // Case-insensitive search
  }
  const posts = await userPostCollection.find(query).sort({ timestamp: -1 }).toArray();
  res.send(posts);
});


// Delete user post by ID
app.delete('/all-user-post/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const result = await userPostCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
          res.status(404).send({ message: 'User post not found' });
      } else {
          res.send({ message: 'User post deleted successfully' });
      }
  } catch (error) {
      res.status(500).send({ message: 'Error deleting user post' });
  }
});

// Assuming you have an Express server set up

// POST endpoint to add money
app.post('/add-money', async (req, res) => {
  try {
      const { amount } = req.body;
      // Validate amount
      if (!amount || isNaN(amount) ) {
          return res.status(400).json({ message: 'Invalid amount' });
      }
      const currentDate = new Date();
      // Insert money into revenue collection with current date
      const result = await TotalRevenueCollection.insertOne({ amount: parseFloat(amount), timestamp: currentDate });
      res.json({ message: 'Money added successfully', insertedId: result.insertedId, date: currentDate });
  } catch (error) {
      console.error('Error adding money:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// GET endpoint to retrieve the list of adding money
app.get('/adding-money-list', async (req, res) => {
  try {
      const addingMoneyList = await TotalRevenueCollection.find({}).sort({ timestamp: -1 }).toArray();
      res.json(addingMoneyList);
  } catch (error) {
      console.error('Error retrieving adding money list:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Add this route to handle DELETE requests for deleting items from the adding money list
app.delete('/adding-money-list/:id', async (req, res) => {
  try {
      const id = req.params.id;
      // Delete the item from the adding money list collection based on the provided ID
      const result = await TotalRevenueCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Item deleted successfully' });
      } else {
          res.status(404).json({ message: 'Item not found' });
      }
  } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// GET endpoint to retrieve the total revenue
app.get('/total-revenue', async (req, res) => {
  try {
      // Aggregate the total revenue from the TotalRevenueCollection
      const totalRevenue = await TotalRevenueCollection.aggregate([
          {
              $group: {
                  _id: null,
                  totalRevenue: { $sum: "$amount" }
              }
          }
      ]).toArray();

      // Send the total revenue as response
      res.json({ totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0 });
  } catch (error) {
      console.error('Error retrieving total revenue:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
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