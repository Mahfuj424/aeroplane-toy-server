const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgokub5.mongodb.net/?retryWrites=true&w=majority`;

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
      await client.connect();
      
    const toyCollection = client.db('aeroplaneDB').collection('toy')
    

    app.get('/allToy', async (req, res) => {
      const limit = parseInt(req.query.limit) || 20;
      const cursor = toyCollection.find();
      const result = await cursor.limit(limit).toArray();
      res.send(result)
    })


    app.get(`/updateToy/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query)
      res.send(result)
    })

    

    app.put('/updateToy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = {upsert: true}
      const updatedToy = req.body;
      const coffee = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          description: updatedToy.description
        }
      }
      const result = await toyCollection.updateOne(filter, coffee, option)
      res.send(result)
    })

    
    app.post('/allToy', async (req, res) => {
      const addToy = req.body;
      const result = await toyCollection.insertOne(addToy)
      res.send(result)
    });


    // const indexKey = { name: 1 };
    // const indexOption = { name: 'toyName' };
    
    // const result = await toyCollection.createIndex(indexKey, indexOption)

    app.get('/searchText', async (req, res) => {
      const searchText = req?.query?.search;
      const result = await toyCollection.find({
        name:{$regex:searchText, $options:"i"}
      }).toArray()
      res.send(result)
    })


    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('toy server site is running')
})

app.listen(port, (req, res) => {
    console.log(`toy server site is running on port: ${port}`);
})