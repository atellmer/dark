import { h, createComponent } from '@dark-engine/core';
import { useParams } from '@dark-engine/web-router';

import { AnimatedRoute } from './animated-route';

const ChildB = createComponent(() => {
  const params = useParams();

  return (
    <AnimatedRoute>
      <h2>Child route B</h2>
      <h3>Route parameter is {params.get('id')}</h3>
      <img src='https://images.unsplash.com/photo-1660307496769-9bab5164f7bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDcxfEpwZzZLaWRsLUhrfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60' />
    </AnimatedRoute>
  );
});

export default ChildB;
