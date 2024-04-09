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
module.exports = {getProducts}