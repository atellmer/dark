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
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <base href='/' />
        <title>{title}</title>
      </head>
      <body>
        <div id='root'>{slot}</div>
        <script src='./build.js' defer></script>
      </body>
    </html>
  );
});

export { Page };
