import { type DarkElement } from '@dark-engine/core';
declare function createRoot(container: Element): {
  render: (element: DarkElement) => void;
  unmount: () => void;
};
export { createRoot };
