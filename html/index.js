global.rootDir = __dirname;
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
const localMongoUri = "mongodb://localhost:27017/localtest`"

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
app.use(cors());
app.use('/management' , express.static(global.rootDir + '/public/Dashboard'));

app.get('/' , (req, res) => {
    res.send('Hello world');
});

app.get('/management' , (req, res) => {
    res.sendFile(
        global.rootDir + '/public/Dashboard/index.html'
    )
});

///////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')

async function getpeople() {
    return new Promise((resolve, reject) => {
        fs.readFile('../dati_persone.json', 'utf8', async (err, data) => {
            if (err) {
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

        for (name of collection_name) {
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
async function people() {
    let persone = {
        Clienti: [],
        Dipendenti: [],
        Manager: []
    }

    return new Promise((resolve, reject) => {
        MongoClient.connect(localMongoUri, async function (err, database) {
            if (err) throw err;
            console.log("DB OK - GET PEOPLE");
            var dbo = database.db("SiteDB");

            dbo.collection("Clienti").find({}).toArray(await function (err, result) {
                if (err) throw err;
                persone.Clienti = result;
            });

            dbo.collection("Dipendenti").find({}).toArray(await function (err, result) {
                if (err) throw err;
                persone.Dipendenti = result;
            });

            dbo.collection("Manager").find({}).toArray(await function (err, result) {
                if (err) throw err;
                persone.Manager = result;
                resolve(persone);
            });
        });
    });
}

async function offices() {
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
    let temp;

    await people().then(
        resp => {
                if (!Object.values(req.query).length) 
                {
                    res.status(200).json(resp)
                } 
                else if ((temp = resp.Clienti.find(elem => elem.nome == req.query.nome || elem.mail == req.query.mail)) != undefined) 
                {
                    res.status(200).json({ "permesso": 1, "val": temp })
                }
                else if ((temp = resp.Dipendenti.find(elem => elem.nome == req.query.nome || elem.mail == req.query.mail)) != undefined) 
                {
                    res.status(200).json({ "permesso": 2, "val": temp })
                } 
                else if ((temp = resp.Manager.find(elem => elem.nome == req.query.nome || elem.mail == req.query.mail)) != undefined) 
                {
                    res.status(200).json({ "permesso": 3, "val": temp })
                } 
                else 
                {
                    res.status(404).send("non trovato")
                }
        });
})

app.get('/mongo/offices', async (req, res) => {

    let dati_uffici = '';
    await offices().then(
        resp => dati_uffici = (!Object.values(req.query).length) ? resp : resp.find(elem => elem.nome == req.query.nome)
    );
    res.status(200).json(dati_uffici);
})

app.get('/mongo/storico', async (req, res) => {

    let data = '';
    let storico = [];

    await people().then(resp => data = resp);

    for (person of data.Clienti)
    {
        storico.push({
            "Nome": person.nome,
            "storico_noleggi": person.storico_noleggi[0] == undefined ? null : person.storico_noleggi
        })
    }

    res.status(200).json(storico);
})

///////////////////////////////////////////////////////////////////////////////////
//MONGO CRUD

app.post('/mongo/posthere', (req, res) => {
    if ((!req.body) || (req.query.type == undefined)) {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }
    let data = req.body;
    let obj = {};
    let coll = '';

    switch (req.query.type) {
        case "uffici":
            obj = {
                nome: data.nome,
                indirizzo: data.indirizzo,
                occupato: data.occupato,
                mq: parseFloat(data.mq),
                tier: parseFloat(data.tier),
                stato: data.stato,
                costo_base: parseFloat(data.costo_base),
                img: data.img,
                descrizione: data.descrizione,
                annotazione: data.annotazione,
                pending: data.pending
            };
            coll = "Uffici";
            break;

        case "user":
            obj = {
                nome: data.nome,
                indirizzo: data.indirizzo,
                mail: data.mail,
                psw: data.psw,
                tier_cliente: parseFloat(data.tier),
                immagine_profilo: data.img,
                annotazioni: data.annotazioni,
                storico_noleggi: data.storico
            };
            coll = "Clienti";
            break;

        case "dipendente":
            obj = {
                nome: data.nome,
                indirizzo: data.indirizzo,
                mail: data.mail,
                psw: data.psw
            };
            coll = "Dipendenti";
            break;

        case "manager":
            obj = {
                nome: data.nome,
                indirizzo: data.indirizzo,
                mail: data.mail,
                psw: data.psw
            };
            coll = "Manager";
            break;

        default:
            res.status(400).send("query errata");
            return;
    }


    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("DB connected!");
        var dbo = database.db("SiteDB");

        dbo.collection(coll).insertOne(obj, function (err, ris) {
            if (err) {
                //res.status(500).json("Internal server error during office addition");
                throw err;
                return;
            }

            console.log(ris);
        });

        res.status(200).json({ "msg": `Added ${data.nome}`, "fields": obj });

    });
});

app.delete('/mongo/deletehere', (req, res) => {
    if (!req.body) {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }
    let coll = '';

    if (req.query.type == "office") {
        coll = "Uffici"
    }
    else {
        coll = "Clienti"
    }

    let chng = req.body.nome == '' ? " " : req.body.nome;
    const query = { nome: chng };

    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("DB connected!");
        var dbo = database.db("SiteDB");


        dbo.collection(coll).deleteOne(query, function (err, ris) {
            if (err) {
                //res.status(500).json("Internal server error during office deletion");
                throw err; return;
            }
            console.log(ris);
        });

        res.status(200).json({ "msg": `Deleted ${req.body.nome}` });

    });
});

app.put('/mongo/puthere', (req, res) => {
    if (!req.body) {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }

    let newvalue = {};
    let coll = '';

    let chng = req.body.ToChange == '' ? " " : req.body.ToChange;

    const query = { nome: chng };

    let data = req.body;

    if (req.query.type=="office")
    {
        if (data.occupato == null)
        {
            newvalue = {
                $set: {
                    nome: data.nome,
                    indirizzo: data.indirizzo,
                    mq: parseFloat(data.mq),
                    tier: parseFloat(data.tier),
                    stato: data.stato,
                    costo_base: parseFloat(data.costo_base),
                    descrizione: data.descrizione,
                    annotazione: data.annotazione
                }
            }
        }
        else
        {
        newvalue = {
                $set: {
                    nome: data.nome,
                    indirizzo: data.indirizzo,
                    mq: parseFloat(data.mq),
                    tier: parseFloat(data.tier),
                    stato: data.stato,
                    costo_base: parseFloat(data.costo_base),
                    descrizione: data.descrizione,
                    annotazione: data.annotazione,
                    occupato: data.occupato
                }
            };
        }
        coll="Uffici"
    }
    else if (req.query.type == "officedisp") 
    {
        let d = new Date();
        let datestring = `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1}-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`;
        let neverdisp = {
            "from": datestring,
            "to": "NC"
        }
        newvalue = {
            $push: {
                occupato: neverdisp
            }
        };
        coll = "Uffici"
    }
    else if (req.query.type == "modcliente") 
    {
        newvalue = {
            $set: {
                nome: data.nome,
                indirizzo: data.indirizzo,
                mail: data.mail,
                psw: data.psw
            }
        };
        coll = "Clienti"
    }
    else 
    {
        newvalue = {
            $set: {
                nome: data.nome,
                indirizzo: data.indirizzo,
                mail: data.mail,
                tier_cliente: parseFloat(data.tier),
                annotazioni: data.annotazione
            }
        };
        coll="Clienti"
    }


    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("DB connected!");
        var dbo = database.db("SiteDB");


        dbo.collection(coll).updateOne(query, newvalue, function (err, ris) {
            if (err) {
                //res.status(500).json("Internal server error during office update");
                throw err; return;
            }

            console.log(ris);
        });

    });
    res.status(200).json({ "msg": `Updated ${chng}`, "newvalue": newvalue });

});


//TODO: prendere date inizio e fine e metterle in occupato
/*
 data: {
    ToChange: this.cliente.nome,
    pending: {
        "office_id": this.data.nome,
        "inizio": this.pick[0],
        "fine": this.pick[1] || this.pick[0],
        "pagamento": this.fattura[13].val,
        "danno": 0,
        "concluso": this.today === this.pick[0] ? "In corso" : "Da iniziare",
        "funzionario": this.NomeCliente === "" ? "" : this.user
    }
}
 */
app.put('/mongo/putpending', (req, res) => {
    if (!req.body) {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }

    let newvalue = {};
    let chng = req.body.ToChange == '' ? " " : req.body.ToChange;
    const query = { nome: chng };
    let data = req.body;
    let ins = false;


    let office = data.office_id;
    let start = data.inizio;
    let end = data.fine;


    if (req.query.type == "ins")
    {
        ins = true;

        newvalue = {
            $push: {
                storico_noleggi: data.pending
            }
        }

        let office_query = { nome: office };

        let office_values = {
            $push: {
                occupato: {"from":start, "to":end}
            }
        }
    }
    else if (req.query.type == "del")
    {
        let arr_inizio = [];
        let arr_fine = [];
        arr_inizio.push(start);
        arr_fine.push(end);

        newvalue = {
            $pull: {occupato: { $elemMatch: {from: { $in: arr_inizio }, to: { $in: arr_fine } } }}
            }
    }
    else 
    {
        res.status(400).send("query errata");
    }

    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("DB connected!");
        var dbo = database.db("SiteDB");

        dbo.collection("Clienti").updateOne(query, newvalue, function (err, ris) {
            if (err)
            {
                throw err; 
                return;
            }

            console.log(ris);
        });   
        
        if(ins)
        {
            dbo.collection("Uffici").updateOne(office_query, office_values, function (err, ris) {
                if (err)
                {
                    throw err; 
                    return;
                }

                console.log(ris);
            });
        }

    });

    res.status(200).json({ "msg": `Updated pending of ${chng}`, "newvalue": newvalue });

});


app.put('/mongo/putnoleggi', (req, res) => {
    if (!req.body) {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }
    let data = req.body;

    let arr_off = [];
    let arr_start = [];
    let arr_end = [];

    arr_off.push(data.office);
    arr_start.push(data.or_inizio);
    arr_end.push(data.or_fine);

    const query = { nome: data.nome, storico_noleggi: { $elemMatch: { office_id: { $in: arr_off }, inizio: { $in: arr_start }, fine: { $in: arr_end } } } };
    
    const newval = {
        $set: { 
            "storico_noleggi.$.inizio": data.inizio ,
            "storico_noleggi.$.fine": data.fine ,
            "storico_noleggi.$.pagamento": data.costo 
            }
    };


    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("DB connected!");
        var dbo = database.db("SiteDB");

        dbo.collection("Clienti").updateOne(query, newval, function (err, ris) {
            if (err) {
                throw err;
                return;
            }

            console.log(ris);
        });

    });
    res.status(200).json("Noleggio modificato");

})

//////////////////////////////////////////////////////////////////////////////////////
//AUTH
require('dotenv').config({ path: `${__dirname}/.env` })

const jwt = require('jsonwebtoken')

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
