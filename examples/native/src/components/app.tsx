import { Frame } from '@nativescript/core';
import {
  type Component,
  h,
  Fragment,
  createComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from '@dark-engine/core';
import {
  type TagNativeElement,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Button,
  NS,
} from '@dark-engine/platform-native';

type Route = {
  path: string;
  component: Component;
};

type Routes = Array<Route>;

type RouterProps = {
  routes: Routes;
};

const Router = createComponent<RouterProps>(({ routes }) => {
  const [path, setPath] = useState('');
  const scope = useMemo(() => ({ refsMap: {}, sync: false }), []);

  useLayoutEffect(() => {
    navigateTo('home', false);
    setTimeout(() => {
      scope.sync = true;
    }, 500);
  }, []);

  const navigateTo = (path: string, animated = true) => {
    const ref = scope.refsMap[path];
    const page = ref.getNativeView() as NS.Page;
    const frame = (page.frame || Frame.topmost()) as NS.Frame;

    if (animated) {
      frame.animated = true;
      frame.transition = {
        name: 'slide',
        duration: 1000,
      };
    }

    frame.navigate(() => page);
    setPath(path);
  };

  return (
    <frame animated={false}>
      {routes.map(x => {
        const setRef = (ref: TagNativeElement<NS.Page>) => {
          scope.refsMap[x.path] = ref;
        };

        return (
          <page id={x.path} ref={setRef} actionBarHidden onNavigatingTo={() => scope.sync && setPath(x.path)}>
            {x.component({ navigateTo })}
          </page>
        );
      })}
    </frame>
  );
});

type RouteComponentProps = {
  navigateTo: (path: string) => void;
};

const Home = createComponent<RouteComponentProps>(({ navigateTo }) => {
  return (
    <stack-layout>
      <label>Home</label>
      <button onTap={() => navigateTo('about')}>go to About</button>
    </stack-layout>
  );
});

const About = createComponent<RouteComponentProps>(({ navigateTo }) => {
  return (
    <stack-layout>
      <label>About</label>
      <button onTap={() => navigateTo('contacts')}>go to Contacts</button>
    </stack-layout>
  );
});

const Contacts = createComponent<RouteComponentProps>(({ navigateTo }) => {
  return (
    <stack-layout>
      <label>Contacts</label>
      <button onTap={() => navigateTo('home')}>go to Home</button>
    </stack-layout>
  );
});

const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'contacts',
    component: Contacts,
  },
];

const App = createComponent(() => {
  return <Router routes={routes} />;
});

export default App;
