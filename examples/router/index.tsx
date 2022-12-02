import { h, Fragment, createComponent, type DarkElement } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

import { createRouter, Router, NavLink } from './router';

const Home = createComponent(() => {
  return (
    <article>
      <h1>Home</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium voluptatum et odio, ipsum cum distinctio,
        facilis consectetur praesentium nam soluta sint, doloremque illo dignissimos nihil. Nesciunt quibusdam accusamus
        placeat expedita maxime soluta eos recusandae libero modi sunt numquam, ipsa enim dolorem unde consequatur
        repellendus ducimus est earum autem! Esse vel provident fugit explicabo corrupti fugiat ducimus, hic eius ea
        repudiandae repellendus! Nisi aspernatur mollitia laudantium vitae non libero minus ipsum repellat. Libero
      </p>
      <img src='https://www.rd.com/wp-content/uploads/2021/03/GettyImages-140594401-1-scaled.jpg?resize=2048,1360' />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium voluptatum et odio, ipsum cum distinctio,
        facilis consectetur praesentium nam soluta sint, doloremque illo dignissimos nihil. Nesciunt quibusdam accusamus
        placeat expedita maxime soluta eos recusandae libero modi sunt numquam, ipsa enim dolorem unde consequatur
        repellendus ducimus est earum autem! Esse vel provident fugit explicabo corrupti fugiat ducimus, hic eius ea
        repudiandae repellendus! Nisi aspernatur mollitia laudantium vitae non libero minus ipsum repellat. Libero
      </p>
    </article>
  );
});

const About = createComponent(() => {
  return (
    <article>
      <h1>About</h1>
      <p>
        Esse vel provident fugit explicabo corrupti fugiat ducimus, hic eius ea repudiandae repellendus! Nisi aspernatur
        mollitia laudantium vitae non libero minus ipsum repellat. Libero eaque, saepe maxime laudantium, ipsa quibusdam
        in voluptates voluptatum aut aperiam asperiores, eos architecto ut. Accusamus obcaecati rerum, a provident vero
        maiores dolores at sunt numquam reprehenderit iure?
      </p>
      <img src='https://www.rd.com/wp-content/uploads/2021/03/GettyImages-728877509.jpg?w=2000' />
      <p>
        us est earum autem! Esse vel provident fugit explicabo corrupti fugiat ducimus, hic eius ea repudiandae
        repellendus! Nisi aspernatur mollitia laudantium vitae non libero minus ipsum repellat. Libero eaque, saepe
        maxime laudantium, ipsa quibusdam in voluptates voluptatum aut aperiam asperiores, eos architecto ut. Accusamus
        obcaecati rerum, a provident vero maiores dolores at sunt numquam reprehenderit iure?
      </p>
    </article>
  );
});

const Contacts = createComponent(() => {
  return (
    <article>
      <h1>Contacts</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat molestias possimus qui expedita. Porro ipsam
        minima magnam neque incidunt consequuntur, commodi ab repudiandae maxime aliquam quod exercitationem, at
        veritatis temporibus?
      </p>
      <img src='https://www.rd.com/wp-content/uploads/2022/04/GettyImages-688972807-e1650569589980.jpg?resize=700,467' />
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat molestias possimus qui expedita. Porro ipsam
        minima magnam neque incidunt consequuntur, commodi ab repudiandae maxime aliquam quod exercitationem, at
        veritatis temporibus?
      </p>
    </article>
  );
});

type ShellProps = {
  route: string;
  slot?: DarkElement;
};

const Shell = createComponent<ShellProps>(({ route, slot }) => {
  const handleAnimationStart = () => {
    document.body.classList.add('overflow-hidden');
  };

  const handleAnimationEnd = () => {
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <>
      <header>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/contacts'>Contacts</NavLink>
      </header>
      <main key={route} onAnimationStart={handleAnimationStart} onAnimationEnd={handleAnimationEnd}>
        {slot}
      </main>
    </>
  );
});

const router = createRouter({
  '/': (props = {}) => <Home {...props} />,
  '/about': (props = {}) => <About {...props} />,
  '/contacts': (props = {}) => <Contacts {...props} />,
});

const App = createComponent(() => {
  return <Router router={router}>{({ slot, ...rest }) => <Shell {...rest}>{slot}</Shell>}</Router>;
});

createRoot(document.getElementById('root')).render(<App />);
