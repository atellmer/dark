import type { SearchBar as NSSearchBar } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { SearchBarAttributes } from '../jsx';
import { searchBar } from '../factory';

export type SearchBarProps = {
  ref?: Ref<SearchBarRef>;
} & SearchBarAttributes;
export type SearchBarRef = NSSearchBar;

const SearchBar = component<SearchBarProps>(props => searchBar(props), {
  displayName: 'SearchBar',
}) as ComponentFactory<SearchBarProps>;

export { SearchBar };
