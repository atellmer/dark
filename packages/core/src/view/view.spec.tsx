/** @jsx h */
import { View, Text, Comment, TagVirtualNode, TextVirtualNode, CommentVirtualNode } from './view';

describe('[View, Text, Comment]', () => {
  test('View creates TagVirtualNodeFactory', () => {
    const div = View({ as: 'div' });

    expect(typeof div === 'function').toBeTruthy();
    expect(div() instanceof TagVirtualNode).toBeTruthy();
    expect(div().name === 'div').toBeTruthy();
  });

  test('Text creates TextVirtualNode', () => {
    const text = Text('Hello');

    expect(text instanceof TextVirtualNode).toBeTruthy();
    expect(text.value).toBe('Hello');
  });

  test('Comment creates CommentVirtualNodeFactory', () => {
    const comment = Comment('Hello');

    expect(typeof comment === 'function').toBeTruthy();
    expect(comment() instanceof CommentVirtualNode).toBeTruthy();
    expect(comment().value).toBe('Hello');
  });
});
