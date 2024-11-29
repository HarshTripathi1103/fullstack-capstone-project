const connectToDatabase = require("../models/db")

router.get('/', async(req,res) => {
    try{
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const gifts = await collection.find({}).toArray();
    res.json(gifts);
} catch {
    console.log('unable to fetch gifts', e);
    res.status(500).send('unable to fetch gifts')
}
})

router.get('/api/gifts/:id' , async(req,res) => {
    try{
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const id = req.params.id;
        const gifts = await collection.find({id : id}).toArray();

        if(!gifts){
            return res.status(404).send(`cannot find gift with id:${id}`);
        }
        res.json(gifts)

    } catch(e) {
       console.log("unable to find gift",e);
       res.status(500).send('Error fetching gift');
    }
})
