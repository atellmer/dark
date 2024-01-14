import { h, Fragment, component, useState, useMemo, useDeferredValue } from '@dark-engine/core';
import { type SyntheticEvent, createRoot } from '@dark-engine/platform-browser';
import { styled } from '@dark-engine/styled';

import { highlight } from './utils';

const Highlight = styled.span<{ $color: string }>`
  color: ${p => p.$color || 'inherit'};
`;

type HighlightedTextProps = {
  value: string;
  query: string;
  color?: string;
};

const HighlightedText = component<HighlightedTextProps>(props => {
  const { value, query, color = '#E91E63' } = props;
  const matches = highlight.match(value, query, value);
  const parts = highlight.parse(value, matches);

  return (
    <span>
      {parts.map((x, idx) => {
        return (
          <Highlight key={`${x.text}${idx}`} $color={x.highlight ? color : undefined}>
            {x.text}
          </Highlight>
        );
      })}
    </span>
  );
});

function generateItems() {
  const items: Array<string> = [];

  for (let i = 0; i < 500; i++) {
    items.push(`Item #${i + 1}`);
  }

  return items;
}

const dummyItems = generateItems();

function filterItems(term: string) {
  if (!term) return dummyItems;
  return dummyItems.filter(x => x.toLowerCase().indexOf(term.toLowerCase()) !== -1);
}

type SlowListItemProps = {
  query: string;
  name: string;
};

const SlowListItem = component<SlowListItemProps>(({ query, name }) => {
  const startTime = performance.now();

  while (performance.now() - startTime < 1.5) {
    // Do nothing for 1.5 ms per item to emulate extremely slow code
  }

  return (
    <li>
      <HighlightedText query={query} value={name} />
    </li>
  );
});

type ItemListProps = {
  name: string;
  isStale: boolean;
};

const ItemList = component<ItemListProps>(({ name, isStale }) => {
  const items = useMemo(() => {
    const items = filterItems(name);

    return (
      <>
        {items.map(x => (
          <SlowListItem key={x} query={name} name={x} />
        ))}
      </>
    );
  }, [name]);

  return <ul style={`color: ${isStale ? '#2196F3' : 'black'}`}>{items}</ul>;
});

const App = component(() => {
  const [name, setName] = useState('');
  const deferredName = useDeferredValue(name);
  const isStale = name !== deferredName;

  const handleInput = (e: SyntheticEvent<InputEvent, HTMLInputElement>) => setName(e.target.value);

  return (
    <div>
      <div>Try quickly entering the number, erasing and re-entering.</div>
      <div>
        Note: Every list item is artificially slowed down. The lagging version of the UI is marked here in blue.
      </div>
      <br />
      <input value={name} placeholder='type number...' onInput={handleInput} />
      <ItemList name={deferredName} isStale={isStale} />
    </div>
  );
});

createRoot(document.getElementById('root')).render(<App />);
