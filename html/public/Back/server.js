const express = require('express');
const app = express();
var cors = require('cors');

app.use(express.json());
app.use('/', express.static(__dirname + '/'));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Back_front.html');
});


const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));