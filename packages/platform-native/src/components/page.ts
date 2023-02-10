import type { Page as NSPage } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { PageAttributes } from '../jsx';
import { page } from '../factory';

export type PageProps = PageAttributes;
export type PageRef = NSPage;

const Page = forwardRef<PageProps, PageRef>(
  createComponent((props, ref) => page({ ref, ...props }), { displayName: 'Page' }),
) as Component<PageProps, PageRef>;

export { Page };
