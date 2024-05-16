import { renderToStream } from '@dark-engine/platform-server';
import { ServerStyleSheet } from '@dark-engine/styled/server';

import { type AppProps, App } from '../frontend/components/app';
import { Page } from '../frontend/components/page';

type BootstrapOptions = {
  props: AppProps;
};

function bootstrap(options: BootstrapOptions) {
  const { props } = options;
  const sheet = new ServerStyleSheet();
  const stream = sheet.interleaveWithStream(
    renderToStream(
      sheet.collectStyles(
        <Page>
          <App {...props} />
        </Page>,
      ),
      { awaitMetatags: true },
    ),
  );

  return stream;
}

export { bootstrap };
