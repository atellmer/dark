import { type DarkElement, component } from '@dark-engine/core';

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
        <meta name='theme-color' content='#000' />
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
