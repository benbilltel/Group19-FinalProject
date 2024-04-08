const MongoClient = require('mongodb').MongoClient
const connectionString = "mongodb://localhost:27017";
const dbName = "web-vlu";
const collectionName = "products"

const getProducts = async ()=>{
    const client = new MongoClient(connectionString)
    try{
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionName)
        const products = await collection.find().toArray();
        return products
    }catch(e){
        console.log("Get products from db error: ",e)
    }finally{
        client.close();
    }
}
const searchProducts = async (query)=>{
    const client = new MongoClient(connectionString)
    try{
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionName)
        const products = await collection.find(query).toArray();
        
        return products
    }catch(e){
        console.log("Search products from db error: ",e)
    }finally{
        client.close();
    }
}
const insertProduct = async (product)=>{
    const client = new MongoClient(connectionString)
    try{
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionName)
        const productInserted = await collection.insertOne(product);
        return productInserted
    }catch(e){
        console.log("Insert product from db error: ",e)
    }finally{
        client.close();
    }
}
const insertProducts = async (products)=>{
    const client = new MongoClient(connectionString)
    try{
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionName)
        const productsInserted = await collection.insertMany(products);
        return productsInserted
    }catch(e){
        console.log("Insert products from db error: ",e)
    }finally{
        client.close();
    }
}

module.exports = {getProducts,searchProducts,insertProduct,insertProducts}