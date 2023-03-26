import { hot } from '../scope';

const __DEV__ = process.env.NODE_ENV === 'development';

function hot$(update: () => void) {
  if (__DEV__) {
    hot.set(true);
  }
  update();
}

export { hot$ as hot };
