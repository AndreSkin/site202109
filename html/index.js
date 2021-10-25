const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello culo');
});

const corsi =
    [
        { id: 1, name: "igsw" },
        {id: 2, name: "so"},
        {id: 3, name: "mariolone bubbarello"}
    ];

app.get('/api/courses', (req, res) => {
    res.send(corsi);
});

app.get('/api/courses/:year/:month', (req, res) => {
    res.send(req.params);
    //res.send(req.query); //per trovare le query dopo il ?
   console.log("ciaone galattico!")});



app.get('/api/courses/:id', (req, res) => {
    const cor = corsi.find(c => c.id === parseInt(req.params.id))
    if (!cor) { res.status(404).send("Stintipacchio catch phrase") }
    else res.send(cor);
});

app.post('/api/courses', (req, res) => {
    if(!req.body.name || req.body.name.length < 3) {
        //400 Bad Request
        res.status(400).send("input sbagliato")
        return;
    }

    const course = {
        id: corsi.length + 1,
        name: req.body.name
    };
    corsi.push(course);
    res.send(course); //convenzione ritornare l'oggetto dopo post
});


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));

//38 minuti