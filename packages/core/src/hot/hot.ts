import { scope$$ } from '../scope';

function hot$(update: () => void) {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV === 'development' && scope$$().setIsHot(true);
  }
  update();
}

export { hot$ as hot };
