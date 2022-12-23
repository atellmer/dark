import 'module-alias/register';
import { join } from 'path';
import * as express from 'express';
import * as compression from 'compression';
import { AddressInfo } from 'net';
import { renderToString } from '@dark-engine/platform-server';

import { App } from './client/app';

const PORT = 3000;
const app = express();

app.use(compression());
app.use(express.static(join(__dirname, 'client')));

app.get('/', (_, res) => {
  const content = createTemplate('Dark SSR', renderToString(App()));

  res.send(content);
});

function createTemplate(title: string, app: string) {
  const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta name="description" content="${title}">
      <base href="/">
      <link rel="icon" href="./favicon.ico">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto"
      />
      <link rel="preload" href="./build.js" as="script" />
      <title>${title}</title>
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
      <script src="./build.js" defer></script>
    </body>
    </html>
  `;

  return content;
}

const server = app.listen(PORT, () => {
  const { port } = server.address() as AddressInfo;

  console.log(`Server is running on http://localhost:${port}`);
});
