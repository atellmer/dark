import { h, component } from '@dark-engine/core';

import { AnimatedRoute } from './animated-route';

const About = component(() => {
  return (
    <AnimatedRoute>
      <h1>About</h1>
      <p>
        Esse vel provident fugit explicabo corrupti fugiat ducimus, hic eius ea repudiandae repellendus! Nisi aspernatur
        mollitia laudantium vitae non libero minus ipsum repellat. Libero eaque, saepe maxime laudantium, ipsa quibusdam
        in voluptates voluptatum aut aperiam asperiores, eos architecto ut. Accusamus obcaecati rerum, a provident vero
        maiores dolores at sunt numquam reprehenderit iure?
      </p>
      <img src='https://images.unsplash.com/photo-1667938404108-da98af6ca60c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80' />
      <p>
        us est earum autem! Esse vel provident fugit explicabo corrupti fugiat ducimus, hic eius ea repudiandae
        repellendus! Nisi aspernatur mollitia laudantium vitae non libero minus ipsum repellat. Libero eaque, saepe
        maxime laudantium, ipsa quibusdam in voluptates voluptatum aut aperiam asperiores, eos architecto ut. Accusamus
        obcaecati rerum, a provident vero maiores dolores at sunt numquam reprehenderit iure?
      </p>
    </AnimatedRoute>
  );
});

export default About;
