import {
  h,
  View,
  createComponent,
} from '../src/core';
import { render } from '../src/platform/browser';

const div = (...props) => View({ as: 'div', ...props });
const host = document.getElementById('root');


const App = createComponent(({ count }) => {
  return (
    <div>
      App component {count}
    </div>
  )
});

render([App({ count: 1 }), App({ count: 2 })], host);
