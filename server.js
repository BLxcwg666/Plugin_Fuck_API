const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const MAX_TXT_URL = 'https://raw.githubusercontent.com/LovelyO0Sam/pgm-api/main/max.txt';
const MIN_TXT_URL = 'https://raw.githubusercontent.com/LovelyO0Sam/pgm-api/main/min.txt';
const MAX_TXT_PATH = path.join(__dirname, 'max.txt');
const MIN_TXT_PATH = path.join(__dirname, 'min.txt');
const BAN_TXT_PATH = path.join(__dirname, 'ban.txt');
const PORT = 9930;

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
  const reqUrl = url.parse(req.url, true); // Parse URL with query parameters

  // re 403
  function send403() {
    res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(path.join(__dirname, '403.html')).pipe(res);
  }

  // server header
  res.setHeader('Server', 'NekoAPI/2.0');

  // limit id format
  const id = reqUrl.query.id;
  if (!id || !/^\d+$/.test(id) || id.length < 9 || id.length > 11) {
    send403();
    return;
  }

  // banlist
  if (fs.existsSync(BAN_TXT_PATH)) {
    const bannedIds = fs.readFileSync(BAN_TXT_PATH, 'utf8').split('\n').map(line => line.trim());
    if (bannedIds.includes(id)) {
      send403();
      return;
    }
  }

  let lines;
  if (reqUrl.pathname === '/min') {
    lines = minLines;
  } else {
    lines = maxLines;
  }

  const line = lines[Math.floor(Math.random() * lines.length)];

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(line);
});

server.listen(PORT, () => {
  console.log(`Server Started at port ${PORT}, Press Ctrl + C to exit.`);
});
