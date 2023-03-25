import { hot } from '../scope';
import { __DEV__ } from '../constants';

function hot$(update: () => void) {
  if (__DEV__) {
    hot.set(true);
  }
  update();
}

export { hot$ as hot };
