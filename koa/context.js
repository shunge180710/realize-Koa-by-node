const proto = {};

//当调用对象属性时就会执行回调
function delegrateGet(type, prop) {
	proto.__defineGetter__(prop, function() {
		return this[type][prop];
	});
}

function delegrateSet(type, prop) {
	proto.__defineSetter__(prop, function(data) {
		this[type][prop] = data;
	});
}

const requestGetArray = ['query'];
const requestSetArray = [];
const responseGetArray = ['status', 'body'];
const responseSetArray = ['status', 'body'];

requestGetArray.forEach(prop => {
	delegrateGet('request', prop);
});
requestSetArray.forEach(prop => {
	delegrateSet('request', prop);
});
responseGetArray.forEach(prop => {
	delegrateGet('response', prop);
});
responseSetArray.forEach(prop => {
	delegrateSet('response', prop);
});

module.exports = proto;
