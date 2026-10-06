import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : path.join(root, 'public');
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || 'localhost';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
};

function getFilePath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}`).pathname);
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.resolve(publicRoot, `.${requestedPath}`);
  return filePath.startsWith(publicRoot + path.sep) ? filePath : null;
}

function sendError(response, statusCode, message) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

function serveFile(request, response, filePath) {
  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      sendError(response, 404, 'Not found');
      return;
    }

    const contentType = contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    const range = request.headers.range;

    if (!range) {
      response.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      });
      if (request.method === 'HEAD') response.end();
      else fs.createReadStream(filePath).pipe(response);
      return;
    }

    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
      response.end();
      return;
    }

    const start = match[1] ? Number(match[1]) : Math.max(stats.size - Number(match[2]), 0);
    const end = match[2] ? Number(match[2]) : stats.size - 1;

    if (start > end || start >= stats.size) {
      response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
      response.end();
      return;
    }

    const safeEnd = Math.min(end, stats.size - 1);
    response.writeHead(206, {
      'Content-Length': safeEnd - start + 1,
      'Content-Range': `bytes ${start}-${safeEnd}/${stats.size}`,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(filePath, { start, end: safeEnd }).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let filePath;
  try {
    filePath = getFilePath(request.url);
  } catch {
    sendError(response, 400, 'Bad request');
    return;
  }

  if (!filePath) {
    sendError(response, 403, 'Forbidden');
    return;
  }

  serveFile(request, response, filePath);
});

server.listen(port, host, () => {
  console.log(`GlassBox running at http://${host}:${port}`);
});
