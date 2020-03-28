const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
//node自带可以实现onerror
const EventEmiteer = require('events');

class Koa extends EventEmiteer {
	constructor() {
		super();
		this.middlewares = [];
	}
	use(middlewares) {
		console.log(middlewares);
		this.middlewares.push(middlewares);
	}

	//实现中间件next前依次调用，后面的倒着调用（其实就是替换掉中间件next的代码）
	compose() {
		return ctx => {
			const createNext = (currentMiddle, oldNext) => {
				// console.log(ctx, oldNext);
				return async () => {
					await currentMiddle(ctx, oldNext);
				};
			};

			const length = this.middlewares.length;
			let next = () => Promise.resolve();

			for (let i = length - 1; i >= 0; i--) {
				let currentMiddle = this.middlewares[i];
				next = createNext(currentMiddle, next);
			}
			return next();
		};
	}
	createContext(req, res) {
		//为了避免重复调用，放在原型链上
		const ctx = Object.create(context);
		ctx.request = Object.create(request);
		ctx.response = Object.create(response);
		ctx.req = req;
		ctx.res = res;
		return ctx;
	}
	callback() {
		return (req, res) => {
			const fn = this.compose();
			const ctx = this.createContext(req, res);

			//body可以以对象形式，做了处理
			const onResponse = () => {
				if (typeof ctx.body === 'object') {
					const result = JSON.stringify(ctx.body);
					ctx.res.end(result);
				} else {
					ctx.res.end(ctx.body);
				}
			};

			//处理报错
			const onError = e => {
				ctx.res.end(e.message);
				this.emit('error', e);
			};
			fn(ctx)
				.then(onResponse)
				.catch(onError);
			// console.log(req, res);
		};
	}

	//实现listen运行
	listen(port, callback) {
		const server = http.createServer(this.callback());
		server.listen(port, callback);
	}
}

module.exports = Koa;
