'use strict';

//const express = require('express');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const router = require('koa-router')();
const serve = require('koa-static');
const getCards = require('./controllers/cards/get-cards');
const deleteCard = require('./controllers/cards/delete-card');
const addCard = require('./controllers/cards/add-card');
const errorThrower = require('./controllers/error');

const app = new Koa();

const port = 3000;

//app.use(express.static('public'));
//app.use(bodyParser.json());
//app.param(['id'], (req, res, next) => next());
router.param('id', (id, ctx, next) => next());

app.use(async(ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})
app.use(async(ctx, next) => {
	try {
		await next();
	} catch (e) {
		console.log('Error detected', e);
		ctx.status = 500;
		ctx.body = `Error ${e.message}`;
	}
})
app.use(bodyParser);
app.use(router.routes());
app.use(serve('./public'));

router.get('/cards', getCards);
router.post('/cards', addCard);
router.delete('/cards/:id', deleteCard);
router.all('/error', errorThrower);

app.listen(port, () => {
	console.log(`App is listening on port ${port}!`);
});
