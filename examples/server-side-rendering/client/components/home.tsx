import { h, component, type DarkElement, useState, useEffect } from '@dark-engine/core';
import { RouterLink, useMatch, useHistory, useParams, useLocation } from '@dark-engine/web-router';

import { AnimatedRoute } from './animated-route';

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
      {slot}
    </AnimatedRoute>
  );
});

export default Home;
