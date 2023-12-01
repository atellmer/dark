import { atom } from '@dark-engine/core';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

class Api {
  private endpoint = 'https://jsonplaceholder.typicode.com/posts';

  async fetchPost(postId: number, ctrl: AbortController) {
    const response = await fetch(`${this.endpoint}/${postId}`, { signal: ctrl.signal });
    const result = (await response.json()) as Post;

    return result;
  }

  async fetchComments(postId: number, ctrl: AbortController) {
    const response = await fetch(`${this.endpoint}/${postId}/comments`, { signal: ctrl.signal });
    const result = (await response.json()) as Array<Comment>;

    return result;
  }
}

const createApi = () => {
  const api = new Api();
  const ctrls: Array<AbortController> = new Array(2).fill(null);
  const abort = () => {
    ctrls.forEach((x, idx, arr) => {
      x?.abort();
      arr[idx] = new AbortController();
    });
  };

  return { api, ctrls, abort };
};

const { api, ctrls, abort } = createApi();
const postId$ = atom(null);
const post$ = atom<Post>(null);
const comments$ = atom<Array<Comment>>([]);

postId$.on(async ({ prev, next }) => {
  if (prev === next) return;
  abort();

  try {
    const [post, comments] = await Promise.all([api.fetchPost(next, ctrls[0]), api.fetchComments(next, ctrls[1])]);

    post$.set(post);
    comments$.set(comments);
  } catch (error) {
    //
  }
});

post$.on(({ next: post }) => console.log('post: ', post));
comments$.on(({ next: comments }) => console.log('comments: ', comments));

// using
postId$.set(1);
postId$.set(2);
postId$.set(3); // loads only this post
