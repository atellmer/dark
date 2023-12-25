import { h } from '@dark-engine/core';
import { renderToStream } from '@dark-engine/platform-server';
import { ServerStyleSheet } from '@dark-engine/styled/server';

import { type AppProps, App } from '../client/components/app';
import { Page } from '../client/components/page';

type BootstrapOptions = {
  title: string;
  props: AppProps;
};

function bootstrap(options: BootstrapOptions) {
  const { title, props } = options;
  const sheet = new ServerStyleSheet();
  const stream = sheet.interleaveWithStream(
    renderToStream(
      sheet.collectStyles(
        <Page title={title}>
          <App {...props} />
        </Page>,
      ),
    ),
  );

  return stream;
}

export { bootstrap };
