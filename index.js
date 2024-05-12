const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7uejvxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const ProductsCollection = client.db('productPulse').collection('queries')
    const addProductsCollection = client.db('productPulse').collection('addQueries')
    const recommendationProductsCollection = client.db('productPulse').collection('recommendQueries')
    // Connect the client to the server	(optional starting in v4.7)

    app.post("/recommendQueries", async (req, res) => {
      const result = await recommendationProductsCollection.insertOne(req.body);
      res.send(result)
    })
    app.get("/recommendQueries/:id", async (req, res) => {
      const result = await recommendationProductsCollection.findOne({ _id: new ObjectId(req.params.id), });
      res.send(result)
    })
    app.get("/recommendedQueries/:email", async (req, res) => {
      const result = await recommendationProductsCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })
    app.delete("/delete/:id", async (req, res) => {
      const result = await recommendationProductsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result)
    })

    app.get('/allQueries', async (req, res) => {
      const result = await ProductsCollection.find().toArray()

      res.send(result)
    })

    app.get("/allQueries/:id", async (req, res) => {
      const result = await ProductsCollection.findOne({ _id: new ObjectId(req.params.id), });
      res.send(result)
    })
  

    app.post("/addQueries", async (req, res) => {
      const result = await addProductsCollection.insertOne(req.body);
      res.send(result)
    })

    app.get("/myQueries/:email", async (req, res) => {
      const result = await addProductsCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    app.get('/products', async (req, res) => {
      const cursor = addProductsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/products/:id", async (req, res) => {
      const result = await addProductsCollection.findOne({ _id: new ObjectId(req.params.id), });
      res.send(result)
    })

    app.get("/singleProduct/:id", async (req, res) => {
      const result = await addProductsCollection.findOne({ _id: new ObjectId(req.params.id), });
      res.send(result)
    })

    app.put("/updateProduct/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          Product_Name: req.body.Product_Name,
          Product_Brand: req.body.Product_Brand,
          image: req.body.image,
          Boycotting_Reason_Details: req.body.Boycotting_Reason_Details,
          Query_Title: req.body.Query_Title,
        }
      }
      const result = await addProductsCollection.updateOne(query, data);
      res.send(result)
    })

    app.delete("/delete/:id", async (req, res) => {
      const result = await addProductsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result)
    })

    //await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Product is Pulsing')
})

app.listen(port, () => {
  console.log(`product is pulsing on port: ${port}`);
})