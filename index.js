'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const getCards = require('./controllers/get-cards');
const deleteCard = require('./controllers/delete-card');
const addCard = require('./controllers/add-card');
const errorThrower = require('./controllers/error');

const app = express();

const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.param(['id'], (req, res, next) => next());

app.get('/', (req, res) => {
	res.send(`<!doctype html>
	<html>
		<head>
			<link rel="stylesheet" href="/style.css">
		</head>
		<body>
			<h1>Hello Smolny!</h1>
		</body>
	</html>`);
});

app.get('/cards', getCards);
app.post('/cards', addCard);
app.delete('/cards/:id', deleteCard);
app.all('/error', errorThrower);

app.listen(port, () => {
	console.log(`YM Node School App listening on port ${port}!`);
});
