import 'module-alias/register';
import { join } from 'node:path';
import express from 'express';
import compression from 'compression';
import { json } from 'body-parser';

import { bootstrap } from './bootstrap';
import { api, createRestApi } from './api';

const PORT = 3000;
const app = express();

app.use(compression());
app.use(json());
app.use('/favicon.ico', express.static(join(__dirname, '../frontend/static/assets/favicon.ico')));
app.use(express.static(join(__dirname, '../frontend/static')));

createRestApi(app);

app.get('*', (req, res) => {
  const { url } = req;
  console.log('url', url);
  const stream = bootstrap({ props: { url, api }, title: 'Dark SSR App' });

  res.statusCode = 200;
  stream.pipe(res);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', err => console.error(err));
