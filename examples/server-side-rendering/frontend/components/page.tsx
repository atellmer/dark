import { type DarkElement, component } from '@dark-engine/core';

type PageProps = {
  slot: DarkElement;
};

const Page = component<PageProps>(({ slot }) => {
  return (
    <html lang='en'>
      <head />
      <body>
        <div id='root'>{slot}</div>
        <script src='/static/build.js' defer />
      </body>
    </html>
  );
});

export { Page };
