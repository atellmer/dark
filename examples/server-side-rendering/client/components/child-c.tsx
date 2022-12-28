import { h, createComponent } from '@dark-engine/core';

import { AnimatedRoute } from './animated-route';

const ChildC = createComponent(() => {
  return (
    <AnimatedRoute>
      <h2>Child route C</h2>
      <img src='https://images.unsplash.com/photo-1667199021796-f5a369a92eaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' />
    </AnimatedRoute>
  );
});

export default ChildC;
