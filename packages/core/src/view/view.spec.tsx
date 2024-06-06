import { View, Text, Comment, TagVirtualNode, TextVirtualNode, CommentVirtualNode } from './view';

describe('@core/view', () => {
  test('The View creates the tag factory', () => {
    const factory = View({ as: 'div' });

    expect(factory).toBeInstanceOf(Function);
    expect(factory()).toBeInstanceOf(TagVirtualNode);
    expect(factory().kind).toBe('div');
  });

  test('The Text creates the text virtual node', () => {
    const text = Text('Hello');

    expect(text).toBeInstanceOf(TextVirtualNode);
    expect(text.value).toBe('Hello');
  });

  test('The Comment creates the comment virtual node', () => {
    const comment = Comment('Hello');

    expect(comment).toBeInstanceOf(CommentVirtualNode);
    expect(comment.value).toBe('Hello');
  });

  test('The View can render zero values correctly', () => {
    expect(View({ as: 'div', slot: 0 })().children).toEqual([0]);
    expect(View({ as: 'div', slot: [0] })().children).toEqual([0]);
    expect(View({ as: 'div', slot: '' })().children).toEqual(['']);
    expect(View({ as: 'div', slot: [''] })().children).toEqual(['']);
    expect(View({ as: 'div', slot: false })().children).toEqual([false]);
    expect(View({ as: 'div', slot: [false] })().children).toEqual([false]);
    expect(View({ as: 'div', slot: null })().children).toEqual([]);
    expect(View({ as: 'div', slot: [null] })().children).toEqual([null]);
    expect(View({ as: 'div', slot: undefined })().children).toEqual([]);
    expect(View({ as: 'div', slot: [undefined] })().children).toEqual([undefined]);
  });
});
