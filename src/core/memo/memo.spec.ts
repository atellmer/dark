import { render } from '../../platform/browser/render';
import { createComponent } from '../component';
import { memo } from './memo';
import { waitNextIdle } from '@test-utils';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

test('memo component works correctly by default', () => {
  const mockFn = jest.fn();
  const App = createComponent(() => {
    mockFn();
    return null;
  });
  const MemoApp = memo(App);

  render(MemoApp({}), host);
  waitNextIdle();
  expect(mockFn).toBeCalledTimes(1);
  render(MemoApp({}), host);
  waitNextIdle();
  expect(mockFn).toBeCalledTimes(1);
});

test('memo component works correctly with custom props comparer', () => {
  type Props = { name: string; age: number };
  const mockFn = jest.fn();
  const App = createComponent<Props>(() => {
    mockFn();
    return null;
  });
  const MemoApp = memo<Props>(App, (props, nextProps) => props.name !== nextProps.name);

  render(MemoApp({ name: 'Alex', age: 24 }), host);
  waitNextIdle();
  expect(mockFn).toBeCalledTimes(1);
  render(MemoApp({ name: 'Alex', age: 26 }), host);
  waitNextIdle();
  expect(mockFn).toBeCalledTimes(1);
  render(MemoApp({ name: 'Jane', age: 24 }), host);
  waitNextIdle();
  expect(mockFn).toBeCalledTimes(2);
  render(MemoApp({ name: 'Jane', age: 28 }), host);
  waitNextIdle();
  expect(mockFn).toBeCalledTimes(2);
});
