import { h, component } from '@dark-engine/core';
import { useParams } from '@dark-engine/web-router';

import { AnimatedRoute } from './animated-route';

const ChildA = component(() => {
  const params = useParams();

  return (
    <AnimatedRoute>
      <h2>Child route A</h2>
      <h3>Route parameter is {params.get('id')}</h3>
      <img src='https://images.unsplash.com/photo-1670100054273-7371cf0816e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' />
    </AnimatedRoute>
  );
});

export default ChildA;