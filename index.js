const express = require("express")
const app = express()
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer")
const PORT = 3000

const { generateCode, generateCodes } = require("./public/js/products")

const MongoClient = require('mongodb').MongoClient
const connectionString = "mongodb://localhost:27017";
const dbName = "web-vlu";
const collectionName = "products"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/pages/home.html"))
})
app.get("/products", (req, res) => {
    const { searchText, min, max, isSearch } = req.query;
    if (Number(isSearch) === 1) {
        let query = {
        };
        let $and = []
        if (Number(max) >= 0) {
            if (Number(max) > Number(min)) {
                $and.push({ price: { $gte: Number(min), $lte: Number(max) } })
            } else if (Number(max) == Number(min) && Number(max) != 0) {
                $and.push({ price: Number(min) })
            }
        }
        if (String(searchText) !== "null") {
            $and.push({ $or: [{ productCode: { $regex: searchText, $options: 'i' } }, { productName: { $regex: searchText, $options: 'i' } }] })
        }
        if ($and.length > 0) {
            query = {
                $and
            }
        }
        const client = new MongoClient(connectionString)
        try {
            client.connect().then(client => {
                const db = client.db(dbName)
                const collection = db.collection(collectionName)
                collection.find(query).toArray().then(products => {
                    const data = JSON.stringify(products);
                    res.json({ message: "Search successfull", Products: data })
                    client.close();
                });
            })
        } catch (e) {
            res.json({ message: e.message })
            console.log(e)
        }
    } else {
        const client = new MongoClient(connectionString)
        try {
            client.connect().then(client => {
                const db = client.db(dbName)
                const collection = db.collection(collectionName)
                collection.find().toArray().then(products => {
                    const data = JSON.stringify(products);
                    res.sendFile(path.resolve(__dirname, "public/pages/products.html"), {
                        headers: {
                            "Content-Type": "text/html",
                            "Products": data
                        }
                    });
                    client.close();
                })
            })
        } catch (e) {
            res.sendFile(path.resolve(__dirname, "public/pages/products.html"), {
                headers: {
                    "Content-Type": "text/html",
                }
            });
            console.log(e)
        }
    }
})
app.get("/products/create", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/pages/create.html"))
})
app.get("/products/update", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/pages/update.html"))
})
app.get("/products/delete", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/pages/delete.html"))
})


app.post("/products/createOne", upload.single("image"), (req, res) => {
    const { productName, category, quantity, price } = req.body;
    const pathImage = req.file.path.replace("public\\", "");
    let product = {
        productName,
        category,
        quantity,
        price,
        image: pathImage
    }
    generateCode(product["category"]).then(newCode => {
        product["productCode"] = newCode
        const client = new MongoClient(connectionString)
        try {
            client.connect().then(client => {
                const db = client.db(dbName)
                const collection = db.collection(collectionName)
                collection.insertOne(product).then(productInserted => {
                    const data = JSON.stringify(productInserted);
                    res.json({ message: "Insert product successfull", Product: data })
                    client.close()
                });
            })

        } catch (e) {
            res.json({ message: e.message })
            console.log(e)
        }
    })
})
app.post("/products/createMany/", (req, res) => {
    const products = req.body;
    generateCodes(products).then(productsHaveCodes => {
        const client = new MongoClient(connectionString)
        try {
            client.connect().then(client => {
                const db = client.db(dbName)
                const collection = db.collection(collectionName)
                collection.insertMany(productsHaveCodes).then(productsInserted => {
                    const data = JSON.stringify(productsInserted);
                    res.json({ message: "Insert products successfull", Products: data })
                    client.close()
                })
            })
        } catch (e) {
            res.json({ message: e.message })
            console.log(e)
        }
    })
});
app.put("/products/updateOne/:code", upload.single("image"), (req, res) => {
    const productCode = req.params.code;
    let { productName, quantity, price } = JSON.parse(req.body.product);
    quantity = Number(quantity)
    price = Number(price)

    if (!req.file) {
        const client = new MongoClient(connectionString);
        try {
            client.connect().then((client) => {
                const db = client.db(dbName);
                const collection = db.collection(collectionName);
                collection
                    .findOneAndUpdate(
                        { productCode: productCode },
                        { $set: { productName, quantity, price } }
                    )
                    .then((productUpdated) => {
                        const data = JSON.stringify(productUpdated);
                        res.json({ message: "Update product successful", Product: data });
                        client.close();
                    });
            });
        } catch (e) {
            res.json({ message: e.message });
            console.log(e);
        }
    } else {

        const image = req.file.path.replace("public\\", "");
        const client = new MongoClient(connectionString);
        try {
            client.connect().then((client) => {
                const db = client.db(dbName);
                const collection = db.collection(collectionName);
                collection
                    .findOneAndUpdate(
                        { productCode: productCode },
                        { $set: { productName, quantity, price, image } }
                    )
                    .then((productUpdated) => {
                        const data = JSON.stringify(productUpdated);
                        res.json({ message: "Update product successful", Product: data });
                        client.close();
                    });
            });
        } catch (e) {
            res.json({ message: e.message });
            console.log(e);
        }
    }
});
let productsToUpdate = []
let productsToUpdateImg = []
app.put("/products/updateSelected", async (req, res) => {
    const client = new MongoClient(connectionString);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        if (productsToUpdate.length > 0) {
            await Promise.all(productsToUpdate.map(async (p) => {
                await collection.findOneAndUpdate(
                    { productCode: p.productCode },
                    { $set: { productName: p.productName, quantity: p.quantity, price: p.price } }
                );
            }));
        }
        if (productsToUpdateImg.length > 0) {
            await Promise.all(productsToUpdateImg.map(async (p) => {
                await collection.findOneAndUpdate(
                    { productCode: p.productCode },
                    { $set: { productName: p.productName, quantity: p.quantity, price: p.price, image: p.image } }
                );
            }));
        }

        res.json({ message: "Update products successful" });
    } catch (e) {
        res.json({ message: e.message });
        console.log(e);
    } finally {
        client.close();
    }
});

app.put("/products/loadDataToUpdate/:action", upload.single("image"), (req, res) => {
    if (Number(req.params.action) == 1) {
        let { productCode, productName, quantity, price } = JSON.parse(req.body.product);
        quantity = Number(quantity)
        price = Number(price)
        if (String(req.body.image) == "false") {
            let product = {
                productCode,
                productName,
                quantity,
                price
            }
            productsToUpdate.push(product)
            res.json({ message: "Load successful" })
        } else {
            const image = req.file.path.replace("public\\", "");
            let product = {
                productCode,
                productName,
                quantity,
                price,
                image
            }
            productsToUpdateImg.push(product)
            res.json({ message: "Load successful" })
        }
    } else {
        productsToUpdate = []
        productsToUpdateImg = []
        res.json({ message: "Clear successful" })
    }
})
app.put("/products/resetPrice", (req, res) => {
    const client = new MongoClient(connectionString);
    try {
        client.connect().then((client) => {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            collection.updateMany(
                { productCode: { $in: req.body.map((code) => code) } },
                { $set: { price : 0 } }
            )
                .then((productsUpdated) => {
                    const data = JSON.stringify(productsUpdated);
                    res.json({ message: "Reset price products successful", Products: data });
                    client.close();
                });
        });
    } catch (e) {
        res.json({ message: e.message });
        console.log(e);
    }
})


app.listen(PORT, () => {
    console.log(`App is listening at port http://127.0.0.1:3000`)
})

