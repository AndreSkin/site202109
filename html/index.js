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

const localMongoUri = "mongodb://site202109:ahmieC6r@mongo_site202109?writeConcern=majority";
//const localMongoUri = "mongodb://localhost:27017/localtest`"

////////////////////////////////////////////////////
//const express = require('express')
//const app = express()
//const passport = require('passport')
//const flash = require('express-flash')
//const session = require('express-session')
//const methodOverride = require('method-override')
////////////////////////////////////////////////

app.use(express.json());
app.use(cors());

app.use(express.static(global.rootDir + 'public'));
app.use(express.static(global.rootDir + 'public/img'));

app.use('/img', express.static(global.rootDir + '/public/img'));

app.use('/management', express.static(global.rootDir + '/public/Dashboard'));
app.use('/backoffice', express.static(global.rootDir + '/public/Back'));
app.use('/', express.static(global.rootDir + '/public/Front'));

app.get('/', (req, res) => {
    res.sendFile(
        global.rootDir + '/public/Front/index.html'
    )
});

app.get('/management', (req, res) => {
    res.sendFile(
        global.rootDir + '/public/Dashboard/index.html'
    )
});

app.get('/backoffice', (req, res) => {
    res.sendFile(
        global.rootDir + '/public/Back/Back_front.html'
    )
});

///////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')

/*Per ragioni di debug si possono prendere i dati anche da file json*/
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

/*Endpoint di creazione delle collezioni base*/
app.get('/mongo/collections', async (req, res) => {
    let collection_name = ["Uffici", "Clienti", "Dipendenti", "Manager"];

    MongoClient.connect(localMongoUri, async function (err, database) {
        if (err) throw err;
        console.log("DB OK - RESET DATA");
        var dbo = database.db("SiteDB");

        for (name of collection_name) {
            //Crea le collezioni di default
            dbo.createCollection(name, function (err, res) {
                if (err) throw err;
                console.log("Collection created! " + name);
            });

            dbo.collection(name).find({}).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
            });
        }
    });
});

/*Endpoint per eliminare tutti i dati*/
app.get('/mongo/dropdata', async (req, res) => {
    let collection_name = ["Uffici", "Clienti", "Dipendenti", "Manager"];

    MongoClient.connect(localMongoUri, async function (err, database) {
        if (err) throw err;
        console.log("DB OK - RESET DATA");
        var dbo = database.db("SiteDB");

        for (name of collection_name) {
            //Svuota le collezioni di default
            dbo.collection(name).deleteMany({}, function (err, result) {
                if (err) throw err;
                console.log(result);
            });
        }
    });
    console.log("\n ////////////////////// \n")
    res.status(200).json("Reset dei dati avvenuto correttamente");
})

/*Endpoint per eliminare tutti i dati persone*/
app.get('/mongo/droppeople', async (req, res) => {
    let collection_name = ["Clienti", "Dipendenti", "Manager"];

    MongoClient.connect(localMongoUri, async function (err, database) {
        if (err) throw err;
        console.log("DB OK - RESET DATA");
        var dbo = database.db("SiteDB");

        for (name of collection_name) {
            dbo.collection(name).deleteMany({}, function (err, result) {
                if (err) throw err;
                console.log(result);
            });
        }
    });
    console.log("\n ////////////////////// \n")
    res.status(200).json("Reset dei dati persone avvenuto correttamente");
})

/*Endpoint per eliminare tutti i dati uffici*/
app.get('/mongo/dropoffices', async (req, res) => {

    MongoClient.connect(localMongoUri, async function (err, database) {
        if (err) throw err;
        console.log("DB OK - RESET DATA");
        var dbo = database.db("SiteDB");

            dbo.collection("Uffici").deleteMany({}, function (err, result) {
                if (err) throw err;
                console.log(result);
            });
    });
    console.log("\n ////////////////////// \n")
    res.status(200).json("Reset dei dati uffici avvenuto correttamente");
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

/*Endpoint che pemette di ottenere tutte le persone o solo i dati di una*/
app.get('/mongo/people', async (req, res) => {
    let temp;

    await people().then(
        resp => {
            if (!Object.values(req.query).length) {
                res.status(200).json(resp)
            }
            else if ((temp = resp.Clienti.find(elem => elem.nome == req.query.nome || elem.mail == req.query.mail)) != undefined) {
                res.status(200).json({ "permesso": 1, "val": temp })
            }
            else if ((temp = resp.Dipendenti.find(elem => elem.nome == req.query.nome || elem.mail == req.query.mail)) != undefined) {
                res.status(200).json({ "permesso": 2, "val": temp })
            }
            else if ((temp = resp.Manager.find(elem => elem.nome == req.query.nome || elem.mail == req.query.mail)) != undefined) {
                res.status(200).json({ "permesso": 3, "val": temp })
            }
            else {
                res.status(404).send("non trovato")
            }
        });
})

/*Endpoint che pemette di ottenere tutti gli uffici o solo i dati di uno*/
app.get('/mongo/offices', async (req, res) => {

    let dati_uffici = '';
    await offices().then(
        resp => dati_uffici = (!Object.values(req.query).length) ? resp : resp.find(elem => elem.nome == req.query.nome)
    );
    res.status(200).json(dati_uffici);
})

/*Endpoint che restituisce ogni persona con il suo storico noleggi*/
app.get('/mongo/storico', async (req, res) => {

    let data = '';
    let storico = [];

    await people().then(resp => data = resp);

    for (person of data.Clienti) {
        storico.push({
            "Nome": person.nome,
            "storico_noleggi": person.storico_noleggi[0] == undefined ? null : person.storico_noleggi
        })
    }

    res.status(200).json(storico);
})

/*Endpoint che restituisce un array di festivitÃ  arbitrarie per il calcolo degli sconti*/
app.get('/feste', async (req, res) => {
    let feste = [
        "2022-01-01",
        "2022-01-06",
        "2022-02-13",
        "2022-02-23",
        "2022-03-15",
        "2022-04-15",
        "2022-04-16",
        "2022-04-17",
        "2022-04-28",
        "2022-05-01",
        "2022-06-14",
        "2022-06-15",
        "2022-06-16",
        "2022-07-13",
        "2022-08-13",
        "2022-08-14",
        "2022-08-15",
        "2022-08-16",
        "2022-09-20",
        "2022-09-21",
        "2022-10-03",
        "2022-10-04",
        "2022-11-01",
        "2022-11-02",
        "2022-11-16",
        "2022-12-08",
        "2022-12-23",
        "2022-12-24",
        "2022-12-25",
        "2022-12-26",
        "2022-12-31"
    ];

    res.status(200).json(feste);

})

///////////////////////////////////////////////////////////////////////////////////
//MONGO CRUD

/*POST: per l'inserimento di nuovi dati nel DB*/
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
        /*Inserimento di un ufficio*/
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
                annotazione: data.annotazione == ""?"Nessuna annotazione":data.annotazione,
                insertion: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
            };
            coll = "Uffici";
            break;
        /*Inserimento di un utente*/
        case "user":
            obj = {
                nome: data.nome,
                indirizzo: data.indirizzo,
                mail: data.mail,
                psw: data.psw,
                tier_cliente: parseFloat(data.tier),
                img: data.img,
                annotazioni: data.annotazioni,
                storico_noleggi: data.storico
            };
            coll = "Clienti";
            break;
        /*Inserimento di un dipendente*/
        case "dipendente":
            obj = {
                nome: data.nome,
                indirizzo: data.indirizzo,
                mail: data.mail,
                psw: data.psw
            };
            coll = "Dipendenti";
            break;
        /*Inserimento di un manager*/
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
                throw err;
                return;
            }

            console.log(ris);
        });

        res.status(200).json({ "msg": `Added ${data.nome}`, "fields": obj });

    });
});

/*DELETE: per l'eliminazione di dati dal DB*/
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

    /*Elemento da eliminare*/
    let chng = req.body.nome == '' ? " " : req.body.nome;
    const query = { nome: chng };

    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("DB connected!");
        var dbo = database.db("SiteDB");


        dbo.collection(coll).deleteOne(query, function (err, ris) {
            if (err) {
                throw err; return;
            }
            console.log(ris);
        });

        res.status(200).json({ "msg": `Deleted ${req.body.nome}` });
    });
});

/*PUT: per la modifica dei dati nel DB*/
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
    /*Modifica uffici*/
    if (req.query.type == "office") {
        /*Non Ã¨ necessario modificare la disponibilitÃ */
        if (data.occupato == null) {
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
        else {
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
                    occupato: data.occupato /*Modifica della disponibilitÃ */
                }
            };
        }
        coll = "Uffici"
    }
    /*L'ufficio deve essere reso non disponibile fino a nuova comunicazione*/
    else if (req.query.type == "officedisp") {
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
    /*Modifica dei clienti*/
    /*Da parte del cliente (psw modificabile)*/
    else if (req.query.type == "modcliente") {
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
    /*Modifica clienti da parte del back office*/
    else {
        newvalue = {
            $set: {
                nome: data.nome,
                indirizzo: data.indirizzo,
                mail: data.mail,
                tier_cliente: parseFloat(data.tier),
                annotazioni: data.annotazione
            }
        };
        coll = "Clienti"
    }


    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("DB connected!");
        var dbo = database.db("SiteDB");


        dbo.collection(coll).updateOne(query, newvalue, function (err, ris) {
            if (err) {
                throw err; return;
            }

            console.log(ris);
        });

    });
    res.status(200).json({ "msg": `Updated ${chng}`, "newvalue": newvalue });

});

/*Modifica dello storico noleggi e conseguente aggiornamento delle date di disponibilitÃ */
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


    let office = data.pending.office_id;
    let start = data.pending.inizio;
    let end = data.pending.fine;

    /*Nuovo noleggio*/
    if (req.query.type == "ins") {
        ins = true;

        newvalue = {
            $push: {
                storico_noleggi: data.pending
            }
        }

        let office_query = { nome: office };
        /*Nuove date*/
        let office_values = {
            $push: {
                occupato: { "from": start, "to": end }
            }
        }
    }
    /*Eliminazione di un noleggio*/
    else if (req.query.type == "del") {
        let arr_inizio = [];
        let arr_fine = [];
        arr_inizio.push(start);
        arr_fine.push(end);

        newvalue = {
            $pull: { occupato: { $elemMatch: { from: { $in: arr_inizio }, to: { $in: arr_fine } } } }
        }
    }
    else {
        res.status(400).send("query errata");
    }

    MongoClient.connect(localMongoUri, function (err, database) {
        if (err) throw err;
        console.log("DB connected!");
        var dbo = database.db("SiteDB");

        dbo.collection("Clienti").updateOne(query, newvalue, function (err, ris) {
            if (err) {
                throw err;
                return;
            }

            console.log(ris);
        });

        if (ins) {
            dbo.collection("Uffici").updateOne(office_query, office_values, function (err, ris) {
                if (err) {
                    throw err;
                    return;
                }

                console.log(ris);
            });
        }

    });

    res.status(200).json({ "msg": `Updated pending of ${chng}`, "newvalue": newvalue });

});

/*Modiifca di un noleggio in corso e della relativa disponibilitÃ */
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

    /*campo.$ = first match*/
    const newval = {
        $set: {
            "storico_noleggi.$.inizio": data.inizio,
            "storico_noleggi.$.fine": data.fine,
            "storico_noleggi.$.pagamento": data.costo
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////77

    const query_occ = { nome: data.office, occupato: { $elemMatch: { from: { $in: arr_start }, to: { $in: arr_end } } } };


    const new_occ = {
        $set: {
            "occupato.$.from": data.inizio,
            "occupato.$.to": data.fine
        }
    }


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

        dbo.collection("Uffici").updateOne(query_occ, new_occ, function (err, ris) {
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



const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Listening on port ${port}...`));
