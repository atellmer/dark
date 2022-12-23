import 'module-alias/register';
import { join } from 'path';
import * as express from 'express';
import { renderToString } from '@dark-engine/platform-server';

import { App } from './client/app';

const PORT = 3000;
const server = express();

server.use(express.static(join(__dirname, 'static')));

server.get('/*', (req, res) => {
  const app = renderToString(App());
  const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto"
      />
      <title>Server rendering dark app</title>
      <style>
        * {
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Roboto';
          color: black;
        }
      </style>
    </head>
    <body>
      <div id="root">${app}</div>
    </body>
    </html>
  `;

  res.send(content);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
