/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { createComponent } from '../component';
import { SplitUpdate, useSplitUpdate } from './split-update';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[split-update]', () => {
  test('renders only updated ui parts', () => {
    type ListItem = { id: number; selected: boolean };

    type AppProps = {
      items: Array<ListItem>;
    };

    type ItemProps = {
      id: number;
    };

    const content = (items: Array<ListItem>) => dom`
      ${items.map(x => `<div>${x.id}:${x.selected}</div>`).join('')}
    `;

    let nextId = 0;

    const buildData = (count: number) => {
      return Array(count)
        .fill(0)
        .map(
          () =>
            ({
              id: ++nextId,
              selected: false,
            } as ListItem),
        );
    };

    const mockFn = jest.fn();

    const getKey = (x: ListItem) => x.id;

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    let items = buildData(10);
    const size = items.length;

    const ListItem = createComponent<ItemProps>(({ id }) => {
      const { selected } = useSplitUpdate<ListItem>(
        map => map[id],
        x => x.selected + '',
      );

      mockFn();

      return (
        <div>
          {id}:{selected + ''}
        </div>
      );
    });

    const App = createComponent<AppProps>(({ items }) => {
      return (
        <SplitUpdate list={items} getKey={getKey}>
          {items.map(x => {
            return <ListItem key={x.id} id={x.id} />;
          })}
        </SplitUpdate>
      );
    });

    render$({ items });
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items));
    expect(mockFn).toHaveBeenCalledTimes(size);

    render$({ items });
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items));
    expect(mockFn).toHaveBeenCalledTimes(size);

    items = [...items];
    render$({ items });
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items));
    expect(mockFn).toHaveBeenCalledTimes(size);

    items[1].selected = true;
    items = [...items];
    render$({ items });
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items));
    expect(mockFn).toHaveBeenCalledTimes(size * 1 + 1);

    items[1].selected = false;
    items[9].selected = true;
    items = [...items];
    render$({ items });
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items));
    expect(mockFn).toHaveBeenCalledTimes(size * 1 + 1 + 2);

    items = [...items];
    render$({ items });
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items));
    expect(mockFn).toHaveBeenCalledTimes(size * 1 + 1 + 2);

    items.shift();
    items = [...items];
    render$({ items });
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items));
    expect(mockFn).toHaveBeenCalledTimes(size * 2 + 1 + 2 - 1);

    items.push(...buildData(2));
    items = [...items];
    render$({ items });
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(items));
    expect(mockFn).toHaveBeenCalledTimes(size * 3 + 1 + 2 - 1 + 1);
  });
});
