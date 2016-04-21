'use strict';

const Rx = require('rx');
const spawn = require('child_process').spawn;
const trace = {};

trace.lookup = (hostname, callback) => {
	const cp = spawn('traceroute', [hostname]);
	let result = '';

	cp.stdout.on('data', (data) => {
		console.log(`data: ${data}`);
		result += data;
	});

	cp.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	cp.on('close', (code) => {

		console.log((getIp(cleanLines(splitByLine(result)))).split(','));
	});
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
