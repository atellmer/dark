/** @jsx h */
import { dom } from '@test-utils';
import { render } from '@dark-engine/platform-browser';
import { createComponent } from '../component';
import { MutableRef } from '../ref';
import { useRef } from '../use-ref';
import { View, Text, Comment, TagVirtualNode, TextVirtualNode, CommentVirtualNode } from './view';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

const div = (props = {}) => View({ ...props, as: 'div' });

describe('[View, Text, Comment]', () => {
  test('View creates the factory', () => {
    const factory = View({ as: 'div' });

    expect(factory).toBeInstanceOf(Function);
    expect(factory()).toBeInstanceOf(TagVirtualNode);
    expect(factory().name).toBe('div');
  });

  test('View can render tags correctly', () => {
    render(div(), host);
    expect(host.innerHTML).toBe('<div></div>');
  });

  test('View can render tags with attributes', () => {
    const content = () => dom`
      <div style="color: red;" class="box" data-some-attr="123"></div>
    `;

    render(div({ style: 'color: red;', class: 'box', 'data-some-attr': 123 }), host);
    expect(host.innerHTML).toBe(content());
  });

  test('View can render nested tags', () => {
    const content = () => dom`
      <div>
        <div>
          <div>ola</div>
        </div>
      </div>
    `;

    render(div({ slot: div({ slot: div({ slot: Text('ola') }) }) }), host);
    expect(host.innerHTML).toBe(content());
  });

  test('Text creates the text virtual node', () => {
    const text = Text('Hello');

    expect(text).toBeInstanceOf(TextVirtualNode);
    expect(text.value).toBe('Hello');
  });

  test('Text can render the text correctly', () => {
    const value = `what's up bitch? 😏`;

    render(Text(value), host);
    expect(host.innerHTML).toBe(value);
  });

  test('Text can prevent xss attacks', () => {
    render(Text(`<script>alert('xss')</script>`), host);
    expect(host.innerHTML).toBe(`&lt;script&gt;alert('xss')&lt;/script&gt;`);
  });

  test('Comment creates the factory', () => {
    const factory = Comment('Hello');

    expect(factory).toBeInstanceOf(Function);
    expect(factory()).toBeInstanceOf(CommentVirtualNode);
    expect(factory().value).toBe('Hello');
  });

  test('Comment can render the comment correctly', () => {
    render(Comment(`😈`), host);
    expect(host.innerHTML).toBe(`<!--😈-->`);
  });

  test('node recreates when key changed', () => {
    type AppProps = {
      x: number;
    };

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    let ref: MutableRef<HTMLDivElement> = null;
    let node: HTMLDivElement = null;

    const App = createComponent<AppProps>(({ x }) => {
      ref = useRef<HTMLDivElement>(null);

      return div({ ref, key: x });
    });

    render$({ x: 1 });
    node = ref.current;
    expect(node).toBeInstanceOf(HTMLDivElement);

    render$({ x: 1 });
    expect(ref.current).toBe(node);

    render$({ x: 2 });
    expect(ref.current).not.toBe(node);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
