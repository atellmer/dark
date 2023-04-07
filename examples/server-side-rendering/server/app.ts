import 'module-alias/register';
import { join } from 'path';
import express from 'express';
import compression from 'compression';
import { AddressInfo } from 'net';

import { bootstrap } from '../client/bootstrap/app.server';

const PORT = 3000;
const app = express();

app.use(compression());
app.use(express.static(join(__dirname, '../client/static')));

app.get('*', async (req, res) => {
  console.log('url', req.url);
  const content = await bootstrap({ url: req.url });
  const page = createPage('Dark SSR', content);

  res.send(page);
});

function createPage(title: string, app: string) {
  const content = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <meta name="description" content="${title}">
      <base href="/" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
      <title>${title}</title>
      <style>
        * {
          box-sizing: border-box;
        }

        html {
          font-size: 14px;
        }

        html,
        body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Roboto';
          background-color: #fafafa;
          overflow: scroll;
        }

        header {
          width: 100%;
          background-color: #03a9f4;
          padding: 6px;
          color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
          display: flex;
          align-items: center;
        }

        header a {
          color: #fff;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        header a:hover {
          color: #fff59d;
        }

        main {
          width: 100%;
          padding: 16px;
          display: flex;
        }

        a {
          margin: 4px;
          text-decoration: none;
          transition: color 0.2s ease-in-out;
        }

        h1 {
          margin: 0;
          margin-bottom: 16px;
        }

        img {
          max-width: 600px;
          margin: 40px auto;
          background-color: #eeeeee;
          object-fit: contain;
        }

        @media (max-width: 800px) {
          img {
            max-width: 100%;
          }
        }

        article {
          margin: 0 auto;
          width: 100%;
          max-width: 1024px;
          display: flex;
          flex-flow: column nowrap;
        }

        p {
          line-height: 2;
        }


        #root {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-rows: 48px 1fr;
        }

        .router-link-active {
          color: #ffeb3b;
          text-decoration: underline;
        }

        .router-link-active:hover {
          color: #ffeb3b;
        }

        .sp-layout {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .sp {
          width: 64px;
          height: 64px;
          clear: both;
          margin: 20px auto;
        }

        .sp-hydrogen {
          position: relative;
          border: 1px #000 solid;
          border-radius: 50%;
          -webkit-animation: spHydro 0.6s infinite linear;
          animation: spHydro 0.6s infinite linear;
        }

        .sp-hydrogen:before,
        .sp-hydrogen:after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #000;
          border-radius: 50%;
        }

        .sp-hydrogen:before {
          top: calc(50% - 5px);
          left: calc(50% - 5px);
        }

        .sp-hydrogen:after {
          top: -1px;
          left: -1px;
        }

        @-webkit-keyframes spHydro {
          from {
            -webkit-transform: rotate(0deg);
          }

          to {
            -webkit-transform: rotate(359deg);
          }
        }

        @keyframes spHydro {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(359deg);
          }
        }

        .animated-route {
          display: flex;
        }

        @keyframes fade {
          0% {
            opacity: 0;
          }

          10% {
            transform: scale(1.05) translate(-50px, 0);
          }

          100% {
            opacity: 100%;
            transform: scale(1) translate(0, 0);
          }
        }

        .fade {
          animation-name: fade;
          animation-iteration-count: 1;
          animation-duration: 600ms;
          animation-fill-mode: both;
          animation-timing-function: ease-in-out;
        }
      </style>
      <link rel="preload" href="build.js" as="script" />
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
