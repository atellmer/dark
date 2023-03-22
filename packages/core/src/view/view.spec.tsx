/** @jsx h */
import { View, Text, Comment, TagVirtualNode, TextVirtualNode, CommentVirtualNode } from './view';

describe('[View, Text, Comment]', () => {
  test('View creates the factory', () => {
    const factory = View({ as: 'div' });

    expect(factory).toBeInstanceOf(Function);
    expect(factory()).toBeInstanceOf(TagVirtualNode);
    expect(factory().name).toBe('div');
  });

  test('Text creates the text virtual node', () => {
    const text = Text('Hello');

    expect(text).toBeInstanceOf(TextVirtualNode);
    expect(text.value).toBe('Hello');
  });

  test('Comment creates the comment virtual node', () => {
    const comment = Comment('Hello');

    expect(comment).toBeInstanceOf(CommentVirtualNode);
    expect(comment.value).toBe('Hello');
  });
});
