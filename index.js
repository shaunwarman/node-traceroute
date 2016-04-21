var spawn = require('child_process').spawn;
var trace = {};

trace.lookup = function (hostname, callback) {
	var cp = spawn('traceroute', [hostname]);
	var result = '';

	cp.stdout.on('data', function (data) {
		result += data;
	});

	cp.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	cp.on('close', function (code) {
		console.log('child process exited with code ' + code);

		console.log((getIp(cleanLines(splitByLine(result)))).split(','));
	});
};

function splitByLine(result) {
	return result.split('\n');
}

function cleanLines(eachLine) {
	return eachLine.filter(function (line) {
		return (line.indexOf('*') === -1);
	});
}

function getIp(cleanLines) {
	return cleanLines.map(function (cleanLine) {
		return cleanLine.slice(cleanLine.indexOf('(') + 1, cleanLine.indexOf(')'));
	});
}

module.exports = trace;
