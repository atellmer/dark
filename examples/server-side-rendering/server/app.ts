import 'module-alias/register';
import { join } from 'node:path';
import express from 'express';
import compression from 'compression';

import { bootstrap } from '../client/bootstrap/app.server';

const PORT = 3000;
const app = express();

app.use(compression());
app.use(express.static(join(__dirname, '../client/static')));

app.get('*', (req, res) => {
  const { url } = req;
  const stream = bootstrap({ props: { url }, title: 'Dark SSR' });

  console.log('url', url);
  res.statusCode = 200;
  stream.pipe(res);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', err => console.error(err));