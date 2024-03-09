const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection URI
const uri = "";

// Create a MongoClient instance
const client = new MongoClient(uri);

async function accessCollection() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database and collection
    const database = client.db("");
    const collection = database.collection("");

    // Define routes

    // Route to add a new product
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      console.log("Product to add:", product);
      await collection.insertOne(product);
      res.redirect("/");
    });

    // Route to retrieve all products
    app.get("/data", async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
      }
    });

    // Route to retrieve a product by ID for update
    app.get("/getUpdateProduct/:id", async (req, res) => {
      try {
        const productId = req.params.id;
        const product = await collection.findOne({
          _id: new ObjectId(productId),
        });

        if (!product) {
          return res.status(404).send("Product not found");
        }

        res.json(product);
      } catch (error) {
        console.error("Error fetching product for update:", error);
        res.status(500).send("Error fetching product for update");
      }
    });

    // Route to update a product
    app.patch("/updateProduct/:id", async (req, res) => {
      try {
        const productId = req.params.id;
        const { name, price, quantity } = req.body;

        const result = await collection.updateOne(
          { _id: new ObjectId(productId) },
          { $set: { name, price, quantity } }
        );

        if (result.modifiedCount === 1) {
          res.status(200).send("Product updated successfully");
        } else {
          res.status(404).send("Product not found");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product");
      }
    });

    // Route to delete a product
    app.delete("/deleteProduct/:id", async (req, res) => {
      try {
        const productId = req.params.id;
        const result = await collection.deleteOne({
          _id: new ObjectId(productId),
        });

        if (result.deletedCount === 1) {
          res.send("Product deleted successfully");
        } else {
          res.status(404).send("Product not found");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product");
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

accessCollection();

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
