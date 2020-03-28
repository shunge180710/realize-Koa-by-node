const Koa = require('./application.js');
const app = new Koa();

app.use(async (ctx, next) => {
	console.log('middle', ctx);
	await next();
	console.log('next');
});
app.use(async (ctx, next) => {
	console.log('middle2');
	await next();
	console.log('next2');
});
app.use(async (ctx, next) => {
	console.log('middle3');
	// ctx.body = '123';
	ctx.body = { meg: 0, code: 0 };
	// throw new Error('报错');
	await next();
	console.log('next3');
});

app.on('error', e => {
	console.log('捕获到错误', e);
});

app.listen(3000, () => {
	console.log('is running');
});
