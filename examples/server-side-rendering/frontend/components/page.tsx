import { type DarkElement, h, component } from '@dark-engine/core';

type PageProps = {
  title: string;
  slot: DarkElement;
};

const Page = component<PageProps>(({ title, slot }) => {
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta http-equiv='X-UA-Compatible' content='ie=edge' />
        <meta name='description' content={title} />
        <link rel='manifest' href='/static/assets/manifest.webmanifest' />
        <link rel='preload' href='/static/assets/fonts/Roboto-Regular.ttf' _as='font' crossorigin='anonymous' />
        <base href='/' />
        <title>{title}</title>
      </head>
      <body>
        <div id='root'>{slot}</div>
        <script src='/static/build.js' defer></script>
      </body>
    </html>
  );
});

export { Page };
