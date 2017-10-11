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

const path = require('path');
const logger = require('../libs/logger')('app');
const {renderToStaticMarkup} = require('react-dom/server');
const ApplicationError = require('../libs/application-error');
const CardsModel = require('./models/cards-model');
const TransactionsModel = require('./models/transactions-model');

const app = new Koa();

const DATA = {
	user: {
		login: 'samuel_johnson',
		name: 'Samuel Johnson'
	}
};

function getView(viewId) {
	const viewPath = path.resolve(__dirname, 'views', `${viewId}.server.js`);
	return require(viewPath);
}

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

router.get('/', (ctx) => {
	const indexView = getView('index');
	const indexViewHtml = renderToStaticMarkup(indexView(DATA));

	ctx.body = indexViewHtml;
});

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

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		logger.error('Error detected', err);
		ctx.status = err instanceof ApplicationError ? err.status : 500;
		ctx.body = `Error [${err.message}] :(`;
	}
});

// Создадим модель Cards и Transactions на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.cardsModel = new CardsModel();
	ctx.transactionsModel = new TransactionsModel();

	await Promise.all([
		ctx.cardsModel.getItems(),
		ctx.transactionsModel.getItems()
	]);

	await next();
});


app.use(bodyParser);
app.use(router.routes());
app.use(serve('./public'));

app.listen(port, () => {
	logger.info('Application started');
});
