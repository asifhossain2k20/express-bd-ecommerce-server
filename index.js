const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express()
const port=process.env.PROT || 5000;
//middlewire
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@cluster0.skhdz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    const productsCollection=client.db('expressBd').collection('products')
    app.get('/products',async(req,res)=>{
        const page=parseInt(req.query.page);
        const size=parseInt(req.query.size);
        console.log(page,size)
        const query={};
        const cursor=productsCollection.find(query)
        const products= await cursor.skip(page*size).limit(size).toArray()
        const count = await productsCollection.estimatedDocumentCount();
        res.send({count,products})
    })
    app.post('/productIds',async(req,res)=>{
        const ids=req.body;
        const objId=ids.map(id=>ObjectId(id));
        const query={_id:{$in:objId}}
        const cursor=productsCollection.find(query)
        const products=await cursor.toArray()
        res.send(products)
    })

}
run().catch(err=>console.log(err))



app.get('/',(req,res)=>{
    res.send('Welcome to Ema John')
})

app.listen(port,()=>{
    console.log(`${port} is Running`);
})