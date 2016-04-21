'use strict';

const Rx = require('rx');
const exec = require('child_process').exec;
const trace = {};

trace.lookup = (hostname, callback) => {
	const source = Rx.Observable.create((observer) => {
		exec('traceroute paypal.com', (error, stdout, stderr) => {
			observer.onNext(stdout);
		});
	});

	source.subscribe((routeInfo) => {
		console.log(getIp(cleanLines(splitByLine(routeInfo))));
	});

	source.dispose();

};

function splitByLine(result) {
	return result.split('\n');
}

function cleanLines(eachLine) {
	return eachLine.filter((line) => {
		return (line.indexOf('*') === -1);
	});
}

function getIp(cleanLines) {
	return cleanLines.map((cleanLine) => {
		return cleanLine.slice(cleanLine.indexOf('(') + 1, cleanLine.indexOf(')'));
	});
}

module.exports = trace;
