import 'module-alias/register';
import { join } from 'node:path';
import zlib from 'node:zlib';
import express from 'express';
import compression from 'compression';
import { json } from 'body-parser';

import { bootstrap } from './bootstrap';
import { api, createRestApi } from './api';

const PORT = 3000;
const app = express();

app.use(compression());
app.use(json());
app.use('/static', express.static(join(__dirname, '../frontend/static')));
app.use('/favicon.ico', express.static(join(__dirname, '../frontend/static/assets/favicon.ico')));
app.use('/robots.txt', express.static(join(__dirname, '../frontend/static/assets/robots.txt')));
app.use('/service-worker.js', express.static(join(__dirname, '../frontend/static/service-worker.js')));
app.use('/service-worker.js.map', express.static(join(__dirname, '../frontend/static/service-worker.js.map')));

createRestApi(app);

app.get('*', (req, res) => {
  const encoding = req.headers['accept-encoding'] || '';
  const { url } = req;
  const stream = bootstrap({ props: { url, api } });

  console.log('url', url);
  res.statusCode = 200;

  if (encoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    stream.pipe(zlib.createGzip()).pipe(res);
  } else {
    stream.pipe(res);
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', err => console.error(err));
