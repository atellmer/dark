import { h, createComponent } from '@dark-engine/core';

import { AnimatedRoute } from './animated-route';

const Contacts = createComponent(() => {
  return (
    <AnimatedRoute>
      <h1>Contacts</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat molestias possimus qui expedita. Porro ipsam
        minima magnam neque incidunt consequuntur, commodi ab repudiandae maxime aliquam quod exercitationem, at
        veritatis temporibus?
      </p>
      <img src='https://images.unsplash.com/photo-1666457384021-fa422f678796?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80' />
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat molestias possimus qui expedita. Porro ipsam
        minima magnam neque incidunt consequuntur, commodi ab repudiandae maxime aliquam quod exercitationem, at
        veritatis temporibus?
      </p>
    </AnimatedRoute>
  );
});

export default Contacts;
