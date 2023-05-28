import { component } from '@dark-engine/core';

import { qMainWindow } from '../factory';

export type WindowProps = {
  windowTitle: string;
};

const Window = component<WindowProps>(props => {
  return qMainWindow(props);
});

export { Window };
