import { h } from '@dark-engine/core';
import { renderToStream } from '@dark-engine/platform-server';
import { type Transform, ServerStyleSheet } from '@dark-engine/styled/server';

import { App, type AppProps } from '../components/app';
import { Page } from '../components/page';

type BootstrapOptions = {
  title: string;
  props: AppProps;
};

function bootstrap(options: BootstrapOptions) {
  const { title, props } = options;
  const sheet = new ServerStyleSheet();
  let stream: Transform = null;

  try {
    stream = sheet.interleaveWithStream(
      renderToStream(
        sheet.collectStyles(
          <Page title={title}>
            <App {...props} />
          </Page>,
        ),
      ),
    );
  } catch (error) {
    sheet.seal();
    console.error(error);
  }

  return stream;
}

export { bootstrap };
