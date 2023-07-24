const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const MAX_TXT_URL = 'https://raw.githubusercontent.com/LovelyO0Sam/pgm-api/main/max.txt';
const MIN_TXT_URL = 'https://raw.githubusercontent.com/LovelyO0Sam/pgm-api/main/min.txt';
const ID_TXT_URL = 'https://raw.githubusercontent.com/LovelyO0Sam/pgm-api/main/id';

const MAX_TXT_PATH = path.join(__dirname, 'api-max.txt');
const MIN_TXT_PATH = path.join(__dirname, 'api-min.txt');
const ID_TXT_PATH = path.join(__dirname, 'api-id.txt');

const PORT = 443;

let maxLines = [];
let minLines = [];
let idLines = [];

fs.unlink(MAX_TXT_PATH, () => {});
fs.unlink(MIN_TXT_PATH, () => {});
fs.unlink(ID_TXT_PATH, () => {});

function downloadFiles() {
  downloadTxtFile(MAX_TXT_URL, MAX_TXT_PATH, (lines) => {
    maxLines = lines;
  });

  downloadTxtFile(MIN_TXT_URL, MIN_TXT_PATH, (lines) => {
    minLines = lines;
  });

  downloadTxtFile(ID_TXT_URL, ID_TXT_PATH, (lines) => {
    idLines = lines;
  });
}

function downloadTxtFile(url, filePath, callback) {
  const file = fs.createWriteStream(filePath);
  const request = https.get(url, (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        const lines = fs.readFileSync(filePath).toString().split('\n');
        callback(lines);
      });
    });
  }).on('error', (err) => {
    console.error(err);
  });
}

downloadFiles();

setInterval(downloadFiles, 24 * 60 * 60 * 1000);

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname !== '/api-min' && reqUrl.pathname !== '/api-max') {
    res.statusCode = 404;
    res.end();
    return;
  }

  if (!reqUrl.query.id) {
    res.statusCode = 404;
    res.end();
    return;
  }

  if (idLines.includes(reqUrl.query.id)) {
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