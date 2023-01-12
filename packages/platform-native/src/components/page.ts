import { Page as NSPage } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { PageAttributes } from '../jsx';
import { page } from '../factory';

export type PageProps = PageAttributes;
export type PageRef = NSPage;

const Page = forwardRef<PageProps, PageRef>(
  createComponent((props, ref) => {
    return page({ ref, ...props });
  }),
);

export { Page };
