import { component } from '@dark-engine/core';

const About = component(
  () => {
    return (
      <article>
        <h1>About</h1>
        <p>
          Esse vel provident fugit explicabo corrupti fugiat ducimus, hic eius ea repudiandae repellendus! Nisi
          aspernatur mollitia laudantium vitae non libero minus ipsum repellat. Libero eaque, saepe maxime laudantium,
          ipsa quibusdam in voluptates voluptatum aut aperiam asperiores, eos architecto ut. Accusamus obcaecati rerum,
          a provident vero maiores dolores at sunt numquam reprehenderit iure?
        </p>
        <img src='./assets/images/2.jpg' />
        <p>
          us est earum autem! Esse vel provident fugit explicabo corrupti fugiat ducimus, hic eius ea repudiandae
          repellendus! Nisi aspernatur mollitia laudantium vitae non libero minus ipsum repellat. Libero eaque, saepe
          maxime laudantium, ipsa quibusdam in voluptates voluptatum aut aperiam asperiores, eos architecto ut.
          Accusamus obcaecati rerum, a provident vero maiores dolores at sunt numquam reprehenderit iure?
        </p>
      </article>
    );
  },
  { displayName: 'About' },
);

export default About;
