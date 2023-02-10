import type { SearchBar as NSSearchBar } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { SearchBarAttributes } from '../jsx';
import { searchBar } from '../factory';

export type SearchBarProps = SearchBarAttributes;
export type SearchBarRef = NSSearchBar;

const SearchBar = forwardRef<SearchBarProps, SearchBarRef>(
  createComponent((props, ref) => searchBar({ ref, ...props }), { displayName: 'SearchBar' }),
) as Component<SearchBarProps, SearchBarRef>;

export { SearchBar };
