import { h, component, type DarkElement, useState, useEffect } from '@dark-engine/core';
import { RouterLink, useMatch, useHistory, useParams, useLocation } from '@dark-engine/web-router';
import { styled, css } from '@dark-engine/styled';

import { AnimatedRoute } from './animated-route';

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

type HomeProps = {
  slot: DarkElement;
};

const Home = component<HomeProps>(({ slot }) => {
  const { url } = useMatch();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (params.get('id') === 'null') {
      history.push('/home/888');
    }
  }, [location.url]);

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
      {slot}
    </AnimatedRoute>
  );
});

export default Home;
