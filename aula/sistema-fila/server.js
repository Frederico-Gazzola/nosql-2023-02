const express = require('express');
const redis = require('redis');
const app = express();

const client = redis.createClient();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var senha

const cli = redis.createClient({
    password: 'F7kR7SyBep4Cg3groYLvwDdNIB3nPzFb',
    socket: {
        host: 'redis-11094.c82.us-east-1-2.ec2.cloud.redislabs.com',
        port: 11094
    }
});

app.get("/", (req, res) => {
    res.render('index', { senha: 95, fila: "" });
});


app.get("/proximo", (req, res) => {
    res.status(200).send('Ok');
});

app.get("/retirar", (req, res) => {
    res.status(200).send('Ok');
});

app.listen(8000, async () => {
    await cli.connect()
    await cli.del('Senha')
    await cli.del('Fila')
    await cli.rPush('Senha', ['0'])
    senha = await cli.lIndex('Senha', 0)
    console.log('Servidor em execução');
});
