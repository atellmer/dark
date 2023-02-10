import { hot } from '../scope';

let apply = true;

function hot$(update: () => void) {
  apply = false;

  setTimeout(() => {
    if (process.env.NODE_ENV === 'development') {
      hot.set(true);
    }
    apply = true;
    update();
  });
}

const detectCanApplyUpdate = () => {
  if (process.env.NODE_ENV === 'development') {
    return apply;
  }

  return true;
};

export { hot$ as hot, detectCanApplyUpdate };
