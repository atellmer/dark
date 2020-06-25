import { requestIdleCallback, animationFrame } from '@shopify/jest-dom-mocks';

import { render } from './render';
import { createComponent } from '../../../core/component/component';
import { View, Text, Comment } from '../../../core/view/view';
import { dom } from '../../../../test/utils';


let host = null;
const div = (props = {}) => View({ ...props, as: 'div' });

beforeAll(() => {
  animationFrame.mock();
  requestIdleCallback.mock();
});

beforeEach(() => {
  host = document.createElement('div');
});

test('[Render]: render do not throws error', () => {
  const Component = createComponent(() => null);
  const compile = () => {
    render(Component(), host);
  };

  expect(compile).not.toThrowError();
});

test('[Render]: render text correctly', () => {
  const content = 'hello';
  const Component = createComponent(() => Text(content));

  render(Component(), host);
  expect(host.innerHTML).toBe(content);
});

test('[Render]: render tag correctly', () => {
  const content = '<div></div>';
  const Component = createComponent(() => div());

  render(Component(), host);
  expect(host.innerHTML).toBe(content);
});

test('[Render]: render comment correctly', () => {
  const content = 'some comment';
  const Component = createComponent(() => Comment(content));

  render(Component(), host);
  expect(host.innerHTML).toBe(`<!--${content}-->`);
});

test('[Render]: render array of items correctly', () => {
  const content = dom`
    <div></div>
    <div></div>
    <div></div>
  `;
  const Component = createComponent(
    () => [div(), div(), div()],
  );

  render(Component(), host);

  console.log('host', host.innerHTML);

  expect(host.innerHTML).toBe(content);
});
