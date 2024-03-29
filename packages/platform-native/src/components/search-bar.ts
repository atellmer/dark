import type { SearchBar as NSSearchBar } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { SearchBarAttributes } from '../jsx';
import { searchBar } from '../factory';

export type SearchBarProps = SearchBarAttributes;
export type SearchBarRef = NSSearchBar;

const SearchBar = forwardRef<SearchBarProps, SearchBarRef>(
  component((props, ref) => searchBar({ ref, ...props }), { displayName: 'SearchBar' }),
) as ComponentFactory<SearchBarProps, SearchBarRef>;

export { SearchBar };
