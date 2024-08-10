const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const port = 3665;
// const privateKey = fs.readFileSync('./ssl/key.pem');
// const certificate = fs.readFileSync('./ssl/cert.pem');

var db;
var dbCollection;

var mongoPort = 27017;
const url = `mongodb://localhost:${mongoPort}/GroceryDB`;

MongoClient.connect(url)
    .then(function (client) {
        console.log(`Connected successfully to MongoDB server on port ${mongoPort}`);
        db = client.db('GroceryDB');``
        dbCollection = db.collection('Groceries');

    })
    .catch(function (err) {
        console.error('Error connecting to MongoDB server:', err);
    });


//get all items from the database
app.get('/api/Grocery', (req, res) => {
    dbCollection.find({}).sort({lastModified: -1}).toArray()
        .then(function (docs) {
            res.json(docs);
            console.log("returning all items");
        })
        .catch(function (err) {
            console.error('Error getting documents from collection:', err);
            res.status(500).json({message: 'Error getting documents from collection'});
        });
});

//get the latest item from the database, no mobile app usage but can be accessed via browser
app.get('/api/Grocery/Latest', (req, res) => {
    dbCollection.find().sort({lastModified: -1}).limit(1).toArray()
        .then(function (docs) {
            res.json(docs);
        })
        .catch(function (err) {
            console.error('Error getting documents from collection:', err);
            res.status(500).json({message: 'Error getting documents from collection'});
        });
});

//create item in the database
app.post('/api/Grocery', (req, res) => {
    var groceryName = req.body.groceryname;
    var groceryQuantity = req.body.groceryquantity;
    dbCollection.insertOne({ groceryname: groceryName, groceryquantity: groceryQuantity, lastModified: new Date() })
        .then(result => {
            console.log(`Successfully inserted item with _id: ${result.insertedId}`)
            res.status(200).json({message: `Successfully inserted item with _id: ${result.insertedId}`});
        })
        .catch(err => {
            console.error(`Failed to insert item: ${err}`)
            res.status(500).json({message: 'Failed to insert item'});
        });
});

//update item quantity in the database
app.put('/api/Grocery', (req, res) => {
    var groceryId = req.body._id;
    var ObjectId = require('mongodb').ObjectId;
    var itemid = new ObjectId(groceryId);
    var itemUpdates = req.body.updates;
    //itemUpdates.lastModified = new Date();

    dbCollection.updateOne({ _id: itemid }, { $set: itemUpdates })
        .then(result => {
            if (result.matchedCount > 0) {
                console.log(`Successfully updated item id: ${groceryId}`)
                res.status(200).json({ message: `Successfully updated item with id: ${groceryId}` });
            } else {
                console.log(`No items matched with id: ${groceryId}`)
                res.status(404).json({message: `No items matched with id: ${groceryId}`});
            }
        })
        .catch(err => {
            console.error(`Failed to update item: ${err}`)
            res.status(500).json({message: 'Failed to update item'});
        });
});

//delete item from the database by id
app.delete('/api/Grocery/:id', (req, res) => {
    var groceryId = req.params.id;
    var ObjectId = require('mongodb').ObjectId;
    var itemid = new ObjectId(groceryId);

    dbCollection.deleteOne({ _id: itemid })
        .then(result => {
            if (result.deletedCount > 0) {
                console.log(`Successfully deleted item with id: ${groceryId}`)
                res.status(200).json({ message: `Successfully deleted item with id: ${groceryId}` });
            } else {
                console.log(`No items matched with id: ${groceryId}`)
                res.status(404).json({message: `No items matched with id: ${groceryId}`});
            }
        })
        .catch(err => {
            console.error(`Failed to delete item: ${err}`)
            res.status(500).json({message: 'Failed to delete item'});
        });
});


//display index.html
app.get('/', (req, res) => {
    res.sendFile(path('public/index.html'));
});

// https.createServer({
//     key: privateKey,
//     cert: certificate
//   }, app).listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
//   });

//listen on port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


