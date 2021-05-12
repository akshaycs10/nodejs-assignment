const bunyan = require("bunyan"); // Bunyan dependency
const path = require('path');
const {serializeError} = require('serialize-error');
const fs = require('fs');
const config = require('./config.json');
let homePath = config.logPath || path.dirname(require.main.filename)

//This is to print log source line number in log file. This is slow. Dont enable it in production.
if(config.printLogSource == undefined)
	config.printLogSource = false

const logInstanceContainer = {};
const disableLogLevel = 61;
const logLevelNone = "none";
let commonSerializer = {
	data: function(data){
		if(data.error && data.error instanceof Error){
			data.error = serializeError(data.error)
			data.error.stack = data.error.stack.split("\n")
		}
		return data
	}
};

let getLogger = function(options) {
	console.log("ConvosoLogger homePath",homePath)
	if(logInstanceContainer[options.name]){
		console.log("returning an existing logger instance for:", options.name);
		return logInstanceContainer[options.name];
	}
	else{
		//means logger instance doesn't exist in logInstanceContainer, creating new one
		console.log("creating a new logger instance for:", options.name);
		//src: true, WARNING: Determining the log source info is slow. Never use this option in production.
		let streams = [
			{
				stream: process.stdout,
				level: getLogLevel(config.globalLogLevel)
			}, 
			{
				type : 'raw',
				stream : streamWrapper(config.logPath),
				level: getLogLevel(config.globalLogLevel)
			}
		]
		let logger = bunyan.createLogger({
			name: options.name,
			streams: streams,
			serializers: commonSerializer,
			src: config.printLogSource
		});
		logInstanceContainer[options.name] = logger;
		return logger;
	}
}

function getLogLevel(level) {
	return level.toLowerCase() === logLevelNone ? disableLogLevel : level
}

//function to add some extra logObject keys to logs
function streamWrapper(filePath) {
	const fileStream = fs.createWriteStream(filePath, {
		flags: 'a'
	});
	return {
		write: logObject => {
			logObject.message = logObject.msg;
			logObject.levelString = bunyan.nameFromLevel[logObject.level].toUpperCase();
			logObject.timestamp = logObject.time;
			logObject.id = logObject.pid;
			logObject.thread = logObject.pid;
			logObject.msg = ''
			if(logObject.src){
				logObject.filename = logObject.src.file;
				logObject.function = logObject.src.func;
				logObject.linenum = logObject.src.line;
				logObject.context = `${logObject.filename}:${logObject.linenum}:${logObject.function}`;
			}
			fileStream.write(JSON.stringify(logObject)+'\n')
		}
	};
}

module.exports = {
	getConvosoLogger: getLogger
};