const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const MAX_TXT_URL = 'https://raw.githubusercontent.com/LovelyO0Sam/pgm-api/main/max.txt';
const MIN_TXT_URL = 'https://raw.githubusercontent.com/LovelyO0Sam/pgm-api/main/min.txt';
const MAX_TXT_PATH = path.join(__dirname, 'api-max.txt');
const MIN_TXT_PATH = path.join(__dirname, 'api-min.txt');
const PORT = 443;

fs.unlink(MAX_TXT_PATH, () => {});
fs.unlink(MIN_TXT_PATH, () => {});


let maxLines = [];
let minLines = [];


function downloadFiles() {
 https.get(MAX_TXT_URL, (res) => {
 let data = '';
 res.setEncoding('utf8');
 res.on('data', (chunk) => {
 data += chunk;
 });
 res.on('end', () => {
 maxLines = data.split('\n');
 });
 }).on('error', (err) => {
 console.error(err);
 });

 https.get(MIN_TXT_URL, (res) => {
 let data = '';
 res.setEncoding('utf8');
 res.on('data', (chunk) => {
 data += chunk;
 });
 res.on('end', () => {
 minLines = data.split('\n');
 });
 }).on('error', (err) => {
 console.error(err);
 });
}

downloadFiles();

setInterval(downloadFiles, 24 * 60 * 60 * 1000);

const server = http.createServer((req, res) => {
 const reqUrl = url.parse(req.url);

 if (reqUrl.pathname === '/favicon.ico') {
 res.statusCode = 404;
 res.end();
 return;
 }

 let lines;
 if (reqUrl.pathname === '/api-min') {
 lines = minLines;
 } else {
 lines = maxLines;
 }

 const line = lines[Math.floor(Math.random() * lines.length)];

 res.setHeader('Content-Type', 'text/plain; charset=utf-8');
 res.end(line);
});

server.listen(PORT, () => {
 console.log(`Server listening on port ${PORT}`);
});
