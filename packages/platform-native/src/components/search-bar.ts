import { SearchBar as NSSearchBar } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { SearchBarAttributes } from '../jsx';
import { searchBar } from '../factory';

export type SearchBarProps = SearchBarAttributes;
export type SearchBarRef = NSSearchBar;

const SearchBar = forwardRef<SearchBarProps, SearchBarRef>(
  createComponent((props, ref) => {
    return searchBar({ ref, ...props });
  }),
);

export { SearchBar };