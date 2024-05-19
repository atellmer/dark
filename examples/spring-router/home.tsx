import { component, useEffect } from '@dark-engine/core';
import { Metatags } from '@dark-engine/platform-browser';

const Home = component(
  () => {
    useEffect(() => {
      console.log('mount home');
      return () => console.log('unmount home');
    }, []);

    return (
      <article>
        <h1>Home</h1>
        <Metatags>
          <title>Home</title>
        </Metatags>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium voluptatum et odio, ipsum cum distinctio,
          facilis consectetur praesentium nam soluta sint, doloremque illo dignissimos nihil. Nesciunt quibusdam
          accusamus placeat expedita maxime soluta eos recusandae libero modi sunt numquam, ipsa enim dolorem unde
          consequatur repellendus ducimus est earum autem! Esse vel provident fugit explicabo corrupti fugiat ducimus,
          hic eius ea repudiandae repellendus! Nisi aspernatur mollitia laudantium vitae non libero minus ipsum
          repellat. Libero
        </p>
        <img src='./assets/images/1.jpg' />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium voluptatum et odio, ipsum cum distinctio,
          facilis consectetur praesentium nam soluta sint, doloremque illo dignissimos nihil. Nesciunt quibusdam
          accusamus placeat expedita maxime soluta eos recusandae libero modi sunt numquam, ipsa enim dolorem unde
          consequatur repellendus ducimus est earum autem! Esse vel provident fugit explicabo corrupti fugiat ducimus,
          hic eius ea repudiandae repellendus! Nisi aspernatur mollitia laudantium vitae non libero minus ipsum
          repellat. Libero
        </p>
      </article>
    );
  },
  { displayName: 'Home' },
);

export default Home;
