import { Comment, Text, View } from './vnode';


test('[vNode]: standart elements initialized correctly', () => {
  const textVNode = Text('hello');
  const commentVNode = Comment('hello');
  const div = View({ as: 'div' });

  expect(textVNode.type).toBe('TEXT');
  expect(textVNode.text).toBe('hello');
  expect(commentVNode.type).toBe('COMMENT');
  expect(commentVNode.text).toBe('hello');
  expect(div.type).toBe('TAG');
  expect(div.name).toBe('div');
});

test('[vNode]: pass attrubutes to vNode correctly', () => {
  const div = View({ as: 'div', color: 'red', name: 'test', onClick: () => {} });

  expect(div.attrs.color).toBe('red');
  expect(div.attrs.name).toBe('test');
  expect(typeof div.attrs.onClick).toBe('function');
});
