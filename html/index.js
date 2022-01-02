const express = require('express');
const app = express();
var cors = require('cors');


var MongoClient = require('mongodb').MongoClient;
const { get } = require('mongoose');

const mongoCredentials = 
{
	user: "site202109",
	pwd: "ahmieC6r",
	site: "mongo_site202109"
}  

const MongoUrl = "mongodb://site202109:ahmieC6r@mongo_site202109/test?retryWrites=true&w=majority";
const localMongoUri ="mongodb://localhost:27017/localtest`"

////////////////////////////////////////////////////
  //const express = require('express')
  //const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  ////////////////////////////////////////////////

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello culo');
});



function Mongo() {
    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("Database created!");
        var dbo = database.db("mydb");
        var OurID = 1;
        var myobj = [
            { name: "Skin", address: "Via delle vie 1", _id: OurID++ },
            { name: 'John', address: 'Highway 71', _id: OurID++ },
            { name: 'Peter', address: 'Lowstreet 4', _id: OurID++ },
            { name: 'Amy', address: 'Apple st 652', _id: OurID++ },
            { name: 'Hannah', address: 'Mountain 21', _id: OurID++ },
            { name: 'Michael', address: 'Valley 345', _id: OurID++ },
            { name: 'Sandy', address: 'Ocean blvd 2', _id: OurID++ },
            { name: 'Betty', address: 'Green Grass 1', _id: OurID++ },
            { name: 'Richard', address: 'Sky st 331', _id: OurID++ },
            { name: 'Susan', address: 'One way 98', _id: OurID++ },
            { name: 'Vicky', address: 'Yellow Garden 2', _id: OurID++ },
            { name: 'Ben', address: 'Park Lane 38', _id: OurID++ },
            { name: 'William', address: 'Central st 954', _id: OurID++ },
            { name: 'Chuck', address: 'Main Road 989', _id: OurID++ },
            { name: 'Viola', address: 'Sideway 1633', _id: OurID }
        ];

        /*
        dbo.createCollection("customers", function (err, res) {
            if (err) throw err;
            console.log("Collection created!");
        });
 
        dbo.collection("customers").insertMany(myobj, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
        });
      */

        var query = { name: "Skin" };
        var querynum = {name: "null"};

        dbo.collection("customers").find({}/*{projection: {_id:0 , name:1, address:1}}*/).toArray(function (err, result)
        {
            if (err) throw err;
            console.log(result);
        });

        dbo.collection("customers").find({}).sort({name:1}).limit(5).toArray(function (err, result)
        {
            if (err) throw err;
            console.log(result);
        });

        dbo.collection("customers").deleteMany(querynum, function (err, result)
        {
            if (err) throw err;
            console.log(result);
        });


        var myquery = { name: "Mickey" };
        var newvalues = { $set: { name: "Michelone", address: "Canyon 123" } };

        dbo.collection("customers").updateOne(myquery, newvalues, function (err, res)
        {
            if (err) throw err;
            console.log("1 document updated");
            database.close();
        });

        /*Drop per cancellare collezione*/

    });
}

app.get('/mongo', (req, res) => 
{
    res.send(Mongo());
});


app.get('/mongo/getbyid/:id', (req, res) => {
    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("Database creato!");
        var dbo = database.db("mydb");
        console.log()
        var myid = parseInt(req.params.id);
        let query = {};
        query['_id'] = myid;

        dbo.collection("customers").count({}, function (err, ris) {
            if (err) throw err;
            console.log(ris);
        });

        dbo.collection("customers").findOne(query, function (err, result) {
            if (err) throw err;
            console.log("Trovato uno");
            console.log(result);
            res.send(result);
        });
    });
});


///////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')

async function getpeople()
{
    return new Promise((resolve, reject) => {
        fs.readFile('../dati_persone.json', 'utf8', async (err, data) => {
            if (err) 
            {
                console.error(err)
                return
            }
            resolve(JSON.parse(data));
        })
    })
}

async function getuffici() {
    return new Promise((resolve, reject) => {
        fs.readFile('../dati_uffici.json', 'utf8', async (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            resolve(JSON.parse(data));
        })
    })
}


app.get('/mongo/newdata', async (req, res) => {
    let dati_persone = '';
    let dati_uffici = '';
    await getpeople().then(resp => dati_persone = resp);
    await getuffici().then(resp => dati_uffici = resp);

    let collection_name = ["Uffici", "Clienti", "Dipendenti", "Manager"];

    MongoClient.connect(localMongoUri, async function (err, database) {
        if (err) throw err;
        console.log("DB OK - RESET DATA");
        var dbo = database.db("SiteDB");

        for (name of collection_name) 
        {            
            /*//Crea le collezioni di default
             dbo.createCollection(name, function (err, res) {
                if (err) throw err;
                console.log("Collection created! " + name);
            });*/

            /*dbo.collection(name).find({}).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
            });*/

            //Svuota le collezioni di default
            dbo.collection(name).deleteMany({}, function (err, result) {
                if (err) throw err;
                console.log(result);
            });
        }
        
        dbo.collection("Uffici").insertMany(dati_uffici.Ufficio, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
        });

        dbo.collection("Clienti").insertMany(dati_persone.Clienti, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
        });

        dbo.collection("Dipendenti").insertMany(dati_persone.Dipendenti, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
        });

        dbo.collection("Manager").insertMany(dati_persone.Manager, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
        });
    });
    console.log("\n\n ////////////////////// \n\n")
    res.status(200).json("Reset dei dati avvenuto correttamente");
})

/////////////////////////////////////////////////////////////////////////////////
//GETTER PER PERSONE E UFFICI E RELATIVI ENDPOINT
async function people()
{
    let persone = []

    persone.push({
        "Clienti": '',
        "Dipendenti": '',
        "Manager": ''
    });

    return new Promise((resolve, reject) => {
        MongoClient.connect(localMongoUri, async function (err, database) {
            if (err) throw err;
            console.log("DB OK - GET PEOPLE");
            var dbo = database.db("SiteDB");

            dbo.collection("Clienti").find({}).toArray(await function (err, result) {
                if (err) throw err;
                persone[0].Clienti = result;
            });

            dbo.collection("Dipendenti").find({}).toArray(await function (err, result) {
                if (err) throw err;
                persone[0].Dipendenti = result;
            });

            dbo.collection("Manager").find({}).toArray(await function (err, result) {
                if (err) throw err;
                persone[0].Manager = result;
                resolve(persone);
            });
        });
    });
}

async function offices()
{
    return new Promise((resolve, reject) => {
        MongoClient.connect(localMongoUri, async function (err, database) {
            if (err) throw err;
            console.log("DB OK - GET OFFICES");
            var dbo = database.db("SiteDB");

            dbo.collection("Uffici").find({}).toArray(await function (err, result) {
                if (err) throw err;
                resolve(result)
            });
        });
    });
}

app.get('/mongo/people', async (req, res) => {

    let dati_persone = '';
    await people().then(resp => dati_persone = resp);
    res.status(200).json(dati_persone[0]);
})

app.get('/mongo/offices', async (req, res) => {

    let dati_uffici = '';
    await offices().then(resp => dati_uffici = resp);
    res.status(200).json(dati_uffici);
})

///////////////////////////////////////////////////////////////////////////////////
//MONGO CRUD

app.post('/mongo/posthere', (req, res) => {
    if (!req.body)
    {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }

    MongoClient.connect(localMongoUri, function (err, database)
    {
        if (err) throw err;
        console.log("Database created!");
        var dbo = database.db("mydb");

        const obj = {
            _id: 16,
            name: req.body.name,
            address: req.body.address
        };
        console.log(req.body);

        dbo.collection("customers").insertOne(obj, function (err, res)
        {
            if (err) throw err;
            console.log("Aggiunto uno");
        });

        res.send(obj); //convenzione ritornare l'oggetto dopo post
    });
});


app.delete('/mongo/deletehere', (req, res) => {
    if (!req.body) {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }

    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("Database created!");
        var dbo = database.db("mydb");


        const query = {
            _id: 16
        };
        console.log(req.body);

        dbo.collection("customers").deleteOne(query, function (err, res) {
            if (err) throw err;
            console.log("Tolto uno");
        });

        res.send(query);

    });
});

app.put('/mongo/puthere', (req, res) => {
    if (!req.body) {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }


    console.log(req.body);
    newvalue = { $set: { name: "Stinti" } };
 
    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("Database created!");
        var dbo = database.db("mydb");
   
        const query = {
        _id: 16,
        name: req.body.name,
        address: req.body.address
    };

        dbo.collection("customers").updateOne(query, newvalue, function (err, res) {
            if (err) throw err;
            console.log("Updated uno");
        });

        res.send(query);

    });
	
});

//////////////////////////////////////////////////////////////////////////////////////
//AUTH
require('dotenv').config({ path: `${__dirname}/.env` })

const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    // Authenticate User

    const username = req.body.username
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}



const port = process.env.PORT
app.listen(port, () => console.log(`Listening on port ${port}...`));
