#!/usr/bin/env node

let start = null;
const openModule = require('open');
const open = openModule.default || openModule;

try {
  ({ start } = require('./dist/server'));
} catch {
  ({ start } = require('./dist/index'));
}

const [processArguments] = process.argv.slice(2);
let host = null;
let port = null;

if (processArguments) {
  [host, port] = processArguments.split(':');
}

const resolvedHost = host || 'localhost';
const resolvedPort = port || 13377;

start(resolvedHost, resolvedPort, false);
void open(`http://${resolvedHost}:${resolvedPort}`);
