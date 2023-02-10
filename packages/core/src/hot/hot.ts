import { hot } from '../scope';

function hot$(update: () => void) {
  if (process.env.NODE_ENV === 'development') {
    hot.set(true);
  }

  update();
}

export { hot$ as hot };
