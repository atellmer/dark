import { component } from '@dark-engine/core';

import { Pending } from './pending';

const Contacts = component(
  () => {
    //console.log('CONTACTS');
    return (
      <article>
        <h1>
          Contacts <Pending />
        </h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat molestias possimus qui expedita. Porro ipsam
          minima magnam neque incidunt consequuntur, commodi ab repudiandae maxime aliquam quod exercitationem, at
          veritatis temporibus?
        </p>
        <img src='./assets/images/3.jpg' />
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat molestias possimus qui expedita. Porro ipsam
          minima magnam neque incidunt consequuntur, commodi ab repudiandae maxime aliquam quod exercitationem, at
          veritatis temporibus?
        </p>
      </article>
    );
  },
  { displayName: 'Contacts' },
);

export default Contacts;
