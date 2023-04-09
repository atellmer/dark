import { h } from '@dark-engine/core';
import { renderToStream } from '@dark-engine/platform-server';

import { App, type AppProps } from '../components/app';
import { Page } from '../components/page';

type BootstrapOptions = {
  title: string;
  props: AppProps;
};

function bootstrap(options: BootstrapOptions) {
  const { title, props } = options;

  return renderToStream(
    <Page title={title}>
      <App {...props} />
    </Page>,
  );
}

export { bootstrap };
