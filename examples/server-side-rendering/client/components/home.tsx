import { h, component, type DarkElement, useState, useEffect, useResource } from '@dark-engine/core';
import { RouterLink, useMatch, useHistory, useParams, useLocation } from '@dark-engine/web-router';
import { styled, css } from '@dark-engine/styled';

import { AnimatedRoute } from './animated-route';

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

  async fetchPost(postId: number) {
    const response = await fetch(`${this.endpoint}/${postId}`);
    const result = (await response.json()) as Post;

    return result;
  }

  async fetchComments(postId: number) {
    const response = await fetch(`${this.endpoint}/${postId}/comments`);
    const result = (await response.json()) as Array<Comment>;

    return result;
  }

  async fetchPostAndComments(postId: number) {
    return await Promise.all([this.fetchPost(postId), this.fetchComments(postId)]);
  }
}

const api = new Api();

type HomeProps = {
  slot: DarkElement;
};

const Home = component<HomeProps>(({ slot }) => {
  const { url } = useMatch();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const [count, setCount] = useState(0);
  const id = Number(params.get('id'));
  const resource = useResource(
    () =>
      new Promise<[Post, Array<Comment>]>(resolve =>
        setTimeout(
          () =>
            resolve([
              {
                userId: 1,
                id: 1,
                title: 'Hello world',
                body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
              },
              [
                {
                  postId: 1,
                  id: 1,
                  name: 'Alex',
                  email: 'alex@gmail.com',
                  body: 'wedwed wefwefwe ewfwef',
                },
              ],
            ]),
          300,
        ),
      ),
    [id],
  );
  const { data, loading, error } = resource;

  useEffect(() => {
    if (params.get('id') === 'null') {
      history.push('/home/888');
    }
  }, [location.url]);

  if (loading) return <div>LOADING...</div>;
  if (error) return <div>error: {error}</div>;
  const [post, comments] = data;

  return (
    <AnimatedRoute>
      <h1>Home</h1>
      <header>
        <RouterLink to={`${url}a`}>child route a</RouterLink>
        <RouterLink to={`${url}b`}>child route b</RouterLink>
        <RouterLink to={`${url}c`}>child route c</RouterLink>
        <button onClick={() => setCount(count + 1)}>fired {count} times</button>
      </header>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero excepturi quae harum laborum temporibus?
        Repellendus laboriosam sunt corporis quasi. Quo accusamus aperiam consequuntur quia veritatis nobis minima omnis
        error expedita!
      </p>
      <Button>Default</Button>
      <Button $primary>Primary</Button>
      <div>
        <h4>{post.title}</h4>
        <p>{post.body}</p>
        {
          <ul>
            {comments.map(x => (
              <li key={x.id}>
                <b>{x.email}</b>
                <div>{x.body}</div>
              </li>
            ))}
          </ul>
        }
      </div>
      {slot}
    </AnimatedRoute>
  );
});

const Button = styled.button<{ $primary?: boolean }>`
  display: inline-block;
  font-size: 1rem;
  padding: 0.5rem 0.7rem;
  background-color: var(--color);
  color: var(--text-color);
  border: 1px solid var(--color);
  border-radius: 3px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--hover-color);
  }
  &:active {
    background-color: var(--color);
  }

  ${p => css`
    --color: ${p.$primary ? '#BA68C8' : '#eee'};
    --hover-color: ${p.$primary ? '#8E24AA' : '#E0E0E0'};
    --text-color: ${p.$primary ? '#fff' : '#000'};
  `}
`;

export default Home;
