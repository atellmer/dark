import type { Page as NSPage } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { PageAttributes } from '../jsx';
import { page } from '../factory';

export type PageProps = {
  ref?: Ref<PageRef>;
} & PageAttributes;
export type PageRef = NSPage;

const Page = component<PageProps>(props => page(props), { displayName: 'Page' }) as ComponentFactory<PageProps>;

export { Page };
