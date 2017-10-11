'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const router = require('koa-router')();
const serve = require('koa-static');
const getCards = require('./controllers/cards/get-cards');
const deleteCard = require('./controllers/cards/delete-card');
const addCard = require('./controllers/cards/add-card');
const addTransaction = require('./controllers/transactions/add-transaction');
const getCardTransactions = require('./controllers/transactions/get-card-transactions');
const getAllTransactions = require('./controllers/transactions/get-all-transactions');
const deleteTransaction = require('./controllers/transactions/delete-transaction');
const commitPayment = require('./controllers/payments/commit-mobile-payment');
const commitTransfer = require('./controllers/payments/commit-transfer');
const commitPrepay = require('./controllers/payments/commit-prepay');
const errorThrower = require('./controllers/error');

const app = new Koa();

const port = 3000;

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

router.post('/cards/:id/transactions', addTransaction);
router.get('/cards/:id/transactions', getCardTransactions);
router.get('/cards/transactions', getAllTransactions);
router.delete('/transactions/:id', deleteTransaction);

router.post('/cards/:id/pay', commitPayment);
router.post('/cards/:id/prepay', commitPrepay);
router.post('/cards/:id/transfer', commitTransfer);

app.listen(port, () => {
	console.log(`App is listening on port ${port}!`);
});
